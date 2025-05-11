import express, { Router } from 'express';
import * as movieController from '../controllers/movieController';

const router: Router = express.Router();

// Get popular movies
router.get('/popular', movieController.getPopularMovies);

// Search movies
router.get('/search', movieController.searchMovies);

// Get all genres
router.get('/genres/all', movieController.getGenres);

// Get movie videos
router.get('/:id/videos', movieController.getMovieVideos);

// Config testing endpoints
router.get('/config/test', (req, res) => {
  // Forward to config controller
  const configController = require('../controllers/configController');
  configController.testApiKey(req, res);
});

router.get('/config/status', (req, res) => {
  // Forward to config controller
  const configController = require('../controllers/configController');
  configController.getConfigStatus(req, res);
});

// Get movie details - place this after other specific routes to avoid conflicts
router.get('/:id', movieController.getMovieDetails);

export default router;
