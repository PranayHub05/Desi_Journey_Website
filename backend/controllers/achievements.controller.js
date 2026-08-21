import crypto from 'crypto';
import { readCollection, writeCollection } from '../services/storage.service.js';

export const listAchievements = (req, res) => {
  res.json(readCollection('achievements'));
};

export const getAchievement = (req, res) => {
  const items = readCollection('achievements');
  const item = items.find(a => a.id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Achievement not found' });
  }
};

export const createAchievement = (req, res) => {
  const items = readCollection('achievements');
  const newItem = { 
    ...req.body, 
    id: req.body.id || `ach-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString()
  };
  items.push(newItem);
  writeCollection('achievements', items);
  res.status(201).json(newItem);
};

export const updateAchievement = (req, res) => {
  const items = readCollection('achievements');
  const index = items.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    items[index] = { 
      ...items[index], 
      ...req.body, 
      id: items[index].id,
      updatedAt: new Date().toISOString()
    };
    writeCollection('achievements', items);
    res.json(items[index]);
  } else {
    res.status(404).json({ error: 'Achievement not found' });
  }
};

export const deleteAchievement = (req, res) => {
  let items = readCollection('achievements');
  const initialLength = items.length;
  items = items.filter(a => a.id !== req.params.id);
  if (items.length !== initialLength) {
    writeCollection('achievements', items);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Achievement not found' });
  }
};
