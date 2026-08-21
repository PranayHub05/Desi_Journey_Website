import crypto from 'crypto';
import { readCollection, saveDocument, deleteDocument } from '../services/storage.service.js';

export const listPosts = async (req, res) => {
  try {
    const posts = await readCollection('posts');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await readCollection('posts');
    const post = posts.find(p => p.id === req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const id = req.body.id || `post-${crypto.randomUUID().slice(0, 8)}`;
    const newPost = { 
      ...req.body, 
      id,
      createdAt: new Date().toISOString()
    };
    await saveDocument('posts', id, newPost);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const posts = await readCollection('posts');
    const existing = posts.find(p => p.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const updatedPost = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString()
    };
    await saveDocument('posts', id, updatedPost);
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteDocument('posts', id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
