import express from 'express';
import { listPopups, getActivePopups, createPopup, updatePopup, deletePopup } from '../controllers/popups.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, listPopups);
router.get('/active', getActivePopups);
router.post('/', authMiddleware, createPopup);
router.put('/:id', authMiddleware, updatePopup);
router.delete('/:id', authMiddleware, deletePopup);

export default router;
