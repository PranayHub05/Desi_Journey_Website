import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '../data/tours.json');

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

export const listTours = (req, res) => {
  res.json(readData());
};

export const getTour = (req, res) => {
  const tours = readData();
  const tour = tours.find(t => t.id === req.params.id);
  if (tour) {
    res.json(tour);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const createTour = (req, res) => {
  const tours = readData();
  const newTour = { ...req.body, id: crypto.randomUUID() };
  tours.push(newTour);
  writeData(tours);
  res.status(201).json(newTour);
};

export const updateTour = (req, res) => {
  const tours = readData();
  const index = tours.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    tours[index] = { ...tours[index], ...req.body, id: tours[index].id };
    writeData(tours);
    res.json(tours[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const deleteTour = (req, res) => {
  let tours = readData();
  tours = tours.filter(t => t.id !== req.params.id);
  writeData(tours);
  res.status(204).end();
};
