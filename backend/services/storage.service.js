import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Baseline static seed directory (shipped in the bundle)
const SEED_DIR = path.join(__dirname, '../data');

// Writable directory for serverless environments (AWS Lambda / Vercel /tmp)
const TMP_DIR = path.join(os.tmpdir(), 'desi_journey_data');

// In-memory runtime cache
const memoryCache = {};

/**
 * Ensures the temporary directory exists if needed
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
 * Resolves the appropriate file path to read/write for a collection
 */
const getFilePath = (collection) => {
  const filename = `${collection}.json`;
  const tmpFile = path.join(TMP_DIR, filename);
  const seedFile = path.join(SEED_DIR, filename);

  // If running in /tmp and already copied/written there, use tmpFile
  if (fs.existsSync(tmpFile)) {
    return tmpFile;
  }

  return seedFile;
};

/**
 * Read data for a collection (tours, posts, popups, achievements)
 */
export const readCollection = (collection) => {
  // If present in memory cache, return copy
  if (memoryCache[collection] && Array.isArray(memoryCache[collection])) {
    return JSON.parse(JSON.stringify(memoryCache[collection]));
  }

  const filePath = getFilePath(collection);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[collection] = parsed;
      return JSON.parse(JSON.stringify(parsed));
    }
  } catch (error) {
    console.error(`Error reading ${collection} from ${filePath}:`, error.message);
  }

  // Fallback to seed if tmp read failed
  const seedPath = path.join(SEED_DIR, `${collection}.json`);
  try {
    if (fs.existsSync(seedPath)) {
      const raw = fs.readFileSync(seedPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[collection] = parsed;
      return JSON.parse(JSON.stringify(parsed));
    }
  } catch (seedError) {
    console.error(`Error reading seed for ${collection}:`, seedError.message);
  }

  memoryCache[collection] = [];
  return [];
};

/**
 * Write data for a collection (tours, posts, popups, achievements)
 * Handles local vs read-only serverless filesystem gracefully
 */
export const writeCollection = (collection, data) => {
  // 1. Update in-memory cache immediately
  memoryCache[collection] = JSON.parse(JSON.stringify(data));

  const filename = `${collection}.json`;
  const seedPath = path.join(SEED_DIR, filename);
  const tmpPath = path.join(TMP_DIR, filename);
  const serialized = JSON.stringify(data, null, 2);

  // 2. Try writing to local project directory first (works in local dev)
  try {
    fs.writeFileSync(seedPath, serialized, 'utf8');
    return true;
  } catch (localWriteError) {
    // If local write fails (e.g. EROFS on Vercel Serverless /var/task), write to /tmp
    try {
      ensureTmpDir();
      fs.writeFileSync(tmpPath, serialized, 'utf8');
      return true;
    } catch (tmpWriteError) {
      console.error(`Failed to write ${collection} to /tmp:`, tmpWriteError.message);
      // In-memory cache is still intact for the life of the instance
      return false;
    }
  }
};
