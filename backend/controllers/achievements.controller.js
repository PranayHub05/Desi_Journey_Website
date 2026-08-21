import crypto from 'crypto';
import { readCollection, saveDocument, deleteDocument } from '../services/storage.service.js';

export const listAchievements = async (req, res) => {
  try {
    const items = await readCollection('achievements');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAchievement = async (req, res) => {
  try {
    const items = await readCollection('achievements');
    const item = items.find(a => a.id === req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Achievement not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const id = req.body.id || `ach-${crypto.randomUUID().slice(0, 8)}`;
    const newItem = { 
      ...req.body, 
      id,
      createdAt: new Date().toISOString()
    };
    await saveDocument('achievements', id, newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const id = req.params.id;
    const items = await readCollection('achievements');
    const existing = items.find(a => a.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    const updated = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString()
    };
    await saveDocument('achievements', id, updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteDocument('achievements', id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
