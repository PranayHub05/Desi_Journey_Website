import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Missing Firebase credentials in .env');
  process.exit(1);
}

const cert = admin.credential.cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
});

const app = admin.initializeApp({ credential: cert });
const db = admin.firestore(app);

const collections = ['tours', 'posts', 'popups', 'achievements'];

async function seedCollection(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`No local seed file for ${name}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Seeding ${data.length} items into collection '${name}'...`);

  const batch = db.batch();
  for (const item of data) {
    const docId = item.id || db.collection(name).doc().id;
    const docRef = db.collection(name).doc(docId);
    batch.set(docRef, { ...item, id: docId }, { merge: true });
  }

  await batch.commit();
  console.log(`Successfully seeded '${name}'!`);
}

async function run() {
  try {
    for (const name of collections) {
      await seedCollection(name);
    }
    console.log('All collections seeded successfully into Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

run();
