import { Request, Response } from 'express';
import * as movieService from '../services/movieService';

export const getPopularMovies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    console.log(`Controller: Fetching popular movies, page ${page}`);
    
    const movies = await movieService.fetchPopularMovies(page);
    console.log(`Controller: Returning ${movies.results.length} movies`);
    
    // Always return 200 status even with mock data to keep frontend working
    return res.status(200).json(movies);
  } catch (error: any) {
    console.error('Error in getPopularMovies controller:', error);
    
    // Even on error, return a valid structure with mock data for better UX
    const mockData = await movieService.fetchPopularMovies(1);
    return res.status(200).json({
      ...mockData,
      message: error.message || 'Failed to fetch popular movies. Using fallback data.'
    });
  }
};

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    console.log(`Controller: Searching for "${query}", page ${page}`);
    const movies = await movieService.searchMovies(query, page);
    console.log(`Controller: Search returned ${movies.results?.length || 0} results`);
    
    // Always return 200 status to keep frontend working
    return res.status(200).json(movies);
  } catch (error: any) {
    console.error('Error in searchMovies controller:', error);
    
    try {
      // Return a valid response structure with mock data for better UX
      const mockData = await movieService.searchMovies('mock', 1);
      return res.status(200).json({
        ...mockData,
        message: error.message || 'Failed to search movies. Using fallback data.'
      });
    } catch {
      // Last resort fallback if mock data also fails
      return res.status(200).json({
        results: [],
        page: 1,
        total_pages: 0,
        total_results: 0,
        message: 'Failed to search movies. No results available.'
      });
    }
  }
};

export const getMovieDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movieId = parseInt(id);
    
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'Valid movie ID is required' });
    }
    
    console.log(`Controller: Fetching details for movie ID ${movieId}`);
    const movie = await movieService.fetchMovieDetails(movieId);
    console.log(`Controller: Successfully retrieved details for "${movie.title}"`);
    
    return res.status(200).json(movie);
  } catch (error: any) {
    console.error('Error in getMovieDetails controller:', error);
    
    try {
      // Return a valid movie structure with mock data for better UX
      const mockMovie = await movieService.fetchMovieDetails(1);
      return res.status(200).json({
        ...mockMovie,
        title: `Mock Movie (ID: ${req.params.id})`,
        overview: 'This is mock movie data. The actual movie information could not be retrieved. Please check your API key configuration.',
        message: error.message || 'Failed to fetch movie details. Using fallback data.'
      });
    } catch {
      // Last resort fallback
      return res.status(200).json({
        id: parseInt(req.params.id) || 0,
        title: 'Movie Information Unavailable',
        poster_path: null,
        backdrop_path: null,
        overview: 'Movie details could not be loaded. Please try again later or check the API configuration.',
        release_date: '',
        vote_average: 0,
        runtime: 0,
        genres: []
      });
    }
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

export const getMovieVideos = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movieId = parseInt(id);
    
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }
    
    const videos = await movieService.fetchMovieVideos(movieId);
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error in getMovieVideos controller:', error);
    res.status(500).json({ message: 'Failed to fetch movie videos' });
  }
};
