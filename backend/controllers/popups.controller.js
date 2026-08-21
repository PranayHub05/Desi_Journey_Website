import crypto from 'crypto';
import { readCollection, writeCollection } from '../services/storage.service.js';

export const listPopups = (req, res) => {
  res.json(readCollection('popups'));
};

export const getActivePopups = (req, res) => {
  const popups = readCollection('popups');
  res.json(popups.filter(p => p.active));
};

export const createPopup = (req, res) => {
  const popups = readCollection('popups');
  const newPopup = { 
    ...req.body, 
    id: req.body.id || `popup-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString()
  };
  popups.push(newPopup);
  writeCollection('popups', popups);
  res.status(201).json(newPopup);
};

export const updatePopup = (req, res) => {
  const popups = readCollection('popups');
  const index = popups.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    popups[index] = { 
      ...popups[index], 
      ...req.body, 
      id: popups[index].id,
      updatedAt: new Date().toISOString()
    };
    writeCollection('popups', popups);
    res.json(popups[index]);
  } else {
    res.status(404).json({ error: 'Popup not found' });
  }
};

export const deletePopup = (req, res) => {
  let popups = readCollection('popups');
  const initialLength = popups.length;
  popups = popups.filter(p => p.id !== req.params.id);
  if (popups.length !== initialLength) {
    writeCollection('popups', popups);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Popup not found' });
  }
};
