import crypto from 'crypto';
import { readCollection, writeCollection } from '../services/storage.service.js';

export const listPosts = (req, res) => {
  res.json(readCollection('posts'));
};

export const getPost = (req, res) => {
  const posts = readCollection('posts');
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
};

export const createPost = (req, res) => {
  const posts = readCollection('posts');
  const newPost = { 
    ...req.body, 
    id: req.body.id || `post-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString()
  };
  posts.push(newPost);
  writeCollection('posts', posts);
  res.status(201).json(newPost);
};

export const updatePost = (req, res) => {
  const posts = readCollection('posts');
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts[index] = { 
      ...posts[index], 
      ...req.body, 
      id: posts[index].id,
      updatedAt: new Date().toISOString()
    };
    writeCollection('posts', posts);
    res.json(posts[index]);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
};

export const deletePost = (req, res) => {
  let posts = readCollection('posts');
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== req.params.id);
  if (posts.length !== initialLength) {
    writeCollection('posts', posts);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
};
