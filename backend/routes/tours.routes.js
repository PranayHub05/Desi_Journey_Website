import express from 'express';
import { listTours, getTour, createTour, updateTour, deleteTour } from '../controllers/tours.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', listTours);
router.get('/:id', getTour);
router.post('/', authMiddleware, createTour);
router.put('/:id', authMiddleware, updateTour);
router.delete('/:id', authMiddleware, deleteTour);

export default router;
