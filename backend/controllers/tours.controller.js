import crypto from 'crypto';
import { readCollection, saveDocument, deleteDocument } from '../services/storage.service.js';

export const listTours = async (req, res) => {
  try {
    const tours = await readCollection('tours');
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTour = async (req, res) => {
  try {
    const tours = await readCollection('tours');
    const tour = tours.find(t => t.id === req.params.id);
    if (tour) {
      res.json(tour);
    } else {
      res.status(404).json({ error: 'Tour not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTour = async (req, res) => {
  try {
    const id = req.body.id || `tour-${crypto.randomUUID().slice(0, 8)}`;
    const newTour = { 
      ...req.body, 
      id,
      createdAt: new Date().toISOString()
    };
    await saveDocument('tours', id, newTour);
    res.status(201).json(newTour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tours = await readCollection('tours');
    const existing = tours.find(t => t.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    const updatedTour = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString()
    };
    await saveDocument('tours', id, updatedTour);
    res.json(updatedTour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteDocument('tours', id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
