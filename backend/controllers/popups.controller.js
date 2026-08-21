import crypto from 'crypto';
import { readCollection, saveDocument, deleteDocument } from '../services/storage.service.js';

export const listPopups = async (req, res) => {
  try {
    const popups = await readCollection('popups');
    res.json(popups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActivePopups = async (req, res) => {
  try {
    const popups = await readCollection('popups');
    res.json(popups.filter(p => p.active));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPopup = async (req, res) => {
  try {
    const id = req.body.id || `popup-${crypto.randomUUID().slice(0, 8)}`;
    const newPopup = { 
      ...req.body, 
      id,
      createdAt: new Date().toISOString()
    };
    await saveDocument('popups', id, newPopup);
    res.status(201).json(newPopup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePopup = async (req, res) => {
  try {
    const id = req.params.id;
    const popups = await readCollection('popups');
    const existing = popups.find(p => p.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Popup not found' });
    }
    const updatedPopup = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString()
    };
    await saveDocument('popups', id, updatedPopup);
    res.json(updatedPopup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePopup = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteDocument('popups', id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
