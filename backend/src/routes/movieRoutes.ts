import express, { Router } from 'express';
import * as movieController from '../controllers/movieController';

const router: Router = express.Router();

// Get popular movies
router.get('/popular', (req, res) => movieController.getPopularMovies(req, res));

// Search movies
router.get('/search', (req, res) => movieController.searchMovies(req, res));

// Get all genres
router.get('/genres/all', (req, res) => movieController.getGenres(req, res));

// Get movie details - place this after other specific routes to avoid conflicts
router.get('/:id', (req, res) => movieController.getMovieDetails(req, res));

export default router;
