import express from 'express';
import { 
  listAchievements, 
  getAchievement, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement 
} from '../controllers/achievements.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', listAchievements);
router.get('/:id', getAchievement);
router.post('/', authMiddleware, createAchievement);
router.put('/:id', authMiddleware, updateAchievement);
router.delete('/:id', authMiddleware, deleteAchievement);

export default router;
