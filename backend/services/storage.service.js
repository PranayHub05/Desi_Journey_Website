import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Baseline static seed directory
const SEED_DIR = path.join(__dirname, '../data');

// Writable directory for serverless fallback
const TMP_DIR = path.join(os.tmpdir(), 'desi_journey_data');

// In-memory cache layer for super fast reads
const memoryCache = {};

let db = null;
let isFirestoreInitialized = false;

/**
 * Initialize Firestore Admin connection if environment variables exist
 */
const initFirestore = () => {
  if (isFirestoreInitialized) return db;

  try {
    // 1. Try Base64 encoded Service Account JSON (Cleanest for Vercel/Cloud envs)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
      const decoded = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
      );
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(decoded)
        });
      }
      db = admin.firestore();
      isFirestoreInitialized = true;
      console.log('Connected to Cloud Firestore via Base64 service account.');
      return db;
    }

    // 2. Try raw JSON string
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(parsed)
        });
      }
      db = admin.firestore();
      isFirestoreInitialized = true;
      console.log('Connected to Cloud Firestore via JSON service account.');
      return db;
    }

    // 3. Try individual env variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n')
          })
        });
      }
      db = admin.firestore();
      isFirestoreInitialized = true;
      console.log('Connected to Cloud Firestore persistently.');
      return db;
    }
  } catch (err) {
    console.warn('Could not initialize Firebase Admin SDK:', err.message);
  }

  return db;
};

// Auto-initialize on import
initFirestore();

/**
 * Ensures temporary directory exists for fallback mode
 */
const ensureTmpDir = () => {
  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create tmp dir:', err.message);
  }
};

/**
 * Resolves local file path
 */
const getLocalFilePath = (collection) => {
  const filename = `${collection}.json`;
  const tmpFile = path.join(TMP_DIR, filename);
  const seedFile = path.join(SEED_DIR, filename);

  if (fs.existsSync(tmpFile)) return tmpFile;
  return seedFile;
};

/**
 * Read collection data (supports Firestore with in-memory caching and local fallback)
 */
export const readCollection = async (collection) => {
  const firestore = initFirestore();

  if (firestore) {
    try {
      const snapshot = await firestore.collection(collection).get();
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        memoryCache[collection] = items;
        return JSON.parse(JSON.stringify(items));
      }
    } catch (err) {
      console.error(`Firestore read error on '${collection}':`, err.message);
    }
  }

  // If in-memory cache exists, use it
  if (memoryCache[collection] && Array.isArray(memoryCache[collection])) {
    return JSON.parse(JSON.stringify(memoryCache[collection]));
  }

  // Fallback to local files
  const filePath = getLocalFilePath(collection);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[collection] = parsed;
      return JSON.parse(JSON.stringify(parsed));
    }
  } catch (err) {
    console.error(`Local file read error on '${collection}':`, err.message);
  }

  // Fallback to seed directory
  const seedPath = path.join(SEED_DIR, `${collection}.json`);
  try {
    if (fs.existsSync(seedPath)) {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[collection] = parsed;
      return JSON.parse(JSON.stringify(parsed));
    }
  } catch (seedErr) {
    console.error(`Seed read error on '${collection}':`, seedErr.message);
  }

  memoryCache[collection] = [];
  return [];
};

/**
 * Save an individual document
 */
export const saveDocument = async (collection, id, data) => {
  const firestore = initFirestore();
  const docData = { ...data, id };

  // Update memory cache
  const currentList = memoryCache[collection] || [];
  const idx = currentList.findIndex(item => item.id === id);
  if (idx !== -1) {
    currentList[idx] = docData;
  } else {
    currentList.push(docData);
  }
  memoryCache[collection] = currentList;

  // Persist to Firestore
  if (firestore) {
    try {
      await firestore.collection(collection).doc(id).set(docData, { merge: true });
      return true;
    } catch (err) {
      console.error(`Firestore write error on '${collection}/${id}':`, err.message);
    }
  }

  // Fallback to local write
  return writeCollection(collection, currentList);
};

/**
 * Delete an individual document
 */
export const deleteDocument = async (collection, id) => {
  const firestore = initFirestore();

  // Update memory cache
  const currentList = (memoryCache[collection] || []).filter(item => item.id !== id);
  memoryCache[collection] = currentList;

  // Delete from Firestore
  if (firestore) {
    try {
      await firestore.collection(collection).doc(id).delete();
      return true;
    } catch (err) {
      console.error(`Firestore delete error on '${collection}/${id}':`, err.message);
    }
  }

  // Fallback to local write
  return writeCollection(collection, currentList);
};

/**
 * Write full collection (batch update)
 */
export const writeCollection = async (collection, data) => {
  memoryCache[collection] = JSON.parse(JSON.stringify(data));
  const firestore = initFirestore();

  if (firestore) {
    try {
      const batch = firestore.batch();
      for (const item of data) {
        const docId = item.id || firestore.collection(collection).doc().id;
        const ref = firestore.collection(collection).doc(docId);
        batch.set(ref, { ...item, id: docId }, { merge: true });
      }
      await batch.commit();
      return true;
    } catch (err) {
      console.error(`Firestore batch write error on '${collection}':`, err.message);
    }
  }

  // Fallback to local file / /tmp
  const filename = `${collection}.json`;
  const seedPath = path.join(SEED_DIR, filename);
  const tmpPath = path.join(TMP_DIR, filename);
  const serialized = JSON.stringify(data, null, 2);

  try {
    fs.writeFileSync(seedPath, serialized, 'utf8');
    return true;
  } catch (localWriteError) {
    try {
      ensureTmpDir();
      fs.writeFileSync(tmpPath, serialized, 'utf8');
      return true;
    } catch (tmpWriteError) {
      console.error(`Failed to write ${collection} to /tmp:`, tmpWriteError.message);
      return false;
    }
  }
};
