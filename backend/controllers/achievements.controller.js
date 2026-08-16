import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '../data/achievements.json');

const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
};

export const listAchievements = (req, res) => {
  res.json(readData());
};

export const getAchievement = (req, res) => {
  const items = readData();
  const item = items.find(a => a.id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const createAchievement = (req, res) => {
  const items = readData();
  const newItem = { 
    ...req.body, 
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
};

export const updateAchievement = (req, res) => {
  const items = readData();
  const index = items.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body, id: items[index].id };
    writeData(items);
    res.json(items[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const deleteAchievement = (req, res) => {
  let items = readData();
  items = items.filter(a => a.id !== req.params.id);
  writeData(items);
  res.status(204).end();
};
