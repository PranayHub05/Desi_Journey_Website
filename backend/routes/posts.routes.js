import express from 'express';
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/posts.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', listPosts);
router.get('/:id', getPost);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
