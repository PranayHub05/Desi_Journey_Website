import crypto from 'crypto';
import { readCollection, writeCollection } from '../services/storage.service.js';

export const listTours = (req, res) => {
  res.json(readCollection('tours'));
};

export const getTour = (req, res) => {
  const tours = readCollection('tours');
  const tour = tours.find(t => t.id === req.params.id);
  if (tour) {
    res.json(tour);
  } else {
    res.status(404).json({ error: 'Tour not found' });
  }
};

export const createTour = (req, res) => {
  const tours = readCollection('tours');
  const newTour = { 
    ...req.body, 
    id: req.body.id || `tour-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString()
  };
  tours.push(newTour);
  writeCollection('tours', tours);
  res.status(201).json(newTour);
};

export const updateTour = (req, res) => {
  const tours = readCollection('tours');
  const index = tours.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    tours[index] = { 
      ...tours[index], 
      ...req.body, 
      id: tours[index].id,
      updatedAt: new Date().toISOString()
    };
    writeCollection('tours', tours);
    res.json(tours[index]);
  } else {
    res.status(404).json({ error: 'Tour not found' });
  }
};

export const deleteTour = (req, res) => {
  let tours = readCollection('tours');
  const initialLength = tours.length;
  tours = tours.filter(t => t.id !== req.params.id);
  if (tours.length !== initialLength) {
    writeCollection('tours', tours);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Tour not found' });
  }
};
