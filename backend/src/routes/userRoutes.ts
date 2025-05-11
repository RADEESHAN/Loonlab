import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  addToFavorites, 
  removeFromFavorites,
  getFavorites
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', (req, res) => registerUser(req, res));
router.post('/login', (req, res) => loginUser(req, res));

// Protected routes
router.get('/profile', protect, (req, res) => getUserProfile(req, res));
router.get('/favorites', protect, (req, res) => getFavorites(req, res));
router.post('/favorites', protect, (req, res) => addToFavorites(req, res));
router.delete('/favorites/:id', protect, (req, res) => removeFromFavorites(req, res));

export default router;
