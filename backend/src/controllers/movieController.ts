import { Request, Response } from 'express';
import * as movieService from '../services/movieService';

export const getPopularMovies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const movies = await movieService.fetchPopularMovies(page);
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in getPopularMovies controller:', error);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
};

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const movies = await movieService.searchMovies(query, page);
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error in searchMovies controller:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
};

export const getMovieDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movieId = parseInt(id);
    
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'Valid movie ID is required' });
    }
    
    const movie = await movieService.fetchMovieDetails(movieId);
    res.status(200).json(movie);
  } catch (error) {
    console.error('Error in getMovieDetails controller:', error);
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await movieService.fetchGenres();
    res.status(200).json(genres);
  } catch (error) {
    console.error('Error in getGenres controller:', error);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
};
