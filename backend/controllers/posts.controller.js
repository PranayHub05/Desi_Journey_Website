import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '../data/posts.json');

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

export const listPosts = (req, res) => {
  res.json(readData());
};

export const getPost = (req, res) => {
  const posts = readData();
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const createPost = (req, res) => {
  const posts = readData();
  const newPost = { ...req.body, id: crypto.randomUUID() };
  posts.push(newPost);
  writeData(posts);
  res.status(201).json(newPost);
};

export const updatePost = (req, res) => {
  const posts = readData();
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body, id: posts[index].id };
    writeData(posts);
    res.json(posts[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export const deletePost = (req, res) => {
  let posts = readData();
  posts = posts.filter(p => p.id !== req.params.id);
  writeData(posts);
  res.status(204).end();
};
