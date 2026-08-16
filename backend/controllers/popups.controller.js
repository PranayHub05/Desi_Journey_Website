import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '../data/popups.json');

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

export const listPopups = (req, res) => {
  res.json(readData());
};

export const getActivePopups = (req, res) => {
  const popups = readData();
  res.json(popups.filter(p => p.active));
};

export const createPopup = (req, res) => {
  const popups = readData();
  const newPopup = { 
    ...req.body, 
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  popups.push(newPopup);
  writeData(popups);
  res.status(201).json(newPopup);
};

export const updatePopup = (req, res) => {
  const popups = readData();
  const index = popups.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    popups[index] = { ...popups[index], ...req.body, id: popups[index].id };
    writeData(popups);
    res.json(popups[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const deletePopup = (req, res) => {
  let popups = readData();
  popups = popups.filter(p => p.id !== req.params.id);
  writeData(popups);
  res.status(204).end();
};
