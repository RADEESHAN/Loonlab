import axios from 'axios';
import dotenv from 'dotenv';
import { Movie, MovieResponse, Genre, GenreResponse } from '../models/movie';

dotenv.config();

const API_KEY = process.env.MOVIE_API_KEY;
const BASE_URL = process.env.MOVIE_API_BASE_URL;

// Mock data functions for demo purposes when API key is missing or invalid
const getMockPopularMovies = (page: number = 1): MovieResponse => {
  const results: Movie[] = [
    {
      id: 1,
      title: 'Demo Movie 1',
      poster_path: '/demo-poster1.jpg',
      overview: 'This is a demo movie. Please set up a valid TMDb API key to see real movies.',
      release_date: '2025-01-01',
      vote_average: 8.5,
      genre_ids: [28, 12, 878], // Action, Adventure, Science Fiction
    },
    {
      id: 2,
      title: 'Demo Movie 2',
      poster_path: '/demo-poster2.jpg',
      overview: 'This is another demo movie. Visit the admin page to configure your TMDb API key.',
      release_date: '2025-02-15',
      vote_average: 7.8,
      genre_ids: [35, 10749], // Comedy, Romance
    },
    {
      id: 3,
      title: 'API Key Missing',
      poster_path: '/demo-poster3.jpg',
      overview: 'Your TMDb API key is missing or invalid. Please go to /admin to set up a valid API key.',
      release_date: '2025-05-11',
      vote_average: 9.0,
      genre_ids: [27, 53], // Horror, Thriller
    }
  ];

  return {
    page: page,
    results: results,
    total_pages: 1,
    total_results: results.length
  };
};

const getMockMovieDetails = (id: number): Movie => {
  return {
    id: id,
    title: `Demo Movie ${id}`,
    poster_path: `/demo-poster${id}.jpg`,
    overview: 'This is a demo movie. Please set up a valid TMDb API key to see real movies.',
    release_date: '2025-01-01',
    vote_average: 8.5,
    genre_ids: [28, 12, 878], // Action, Adventure, Science Fiction
  };
};

const getMockSearchResults = (query: string, page: number = 1): MovieResponse => {
  const results: Movie[] = [
    {
      id: 4,
      title: `Search Result: ${query}`,
      poster_path: '/demo-search1.jpg',
      overview: 'This is a demo search result. Please set up a valid TMDb API key to see real search results.',
      release_date: '2025-03-20',
      vote_average: 7.5,
      genre_ids: [18, 36], // Drama, History
    }
  ];

  return {
    page: page,
    results: results,
    total_pages: 1,
    total_results: results.length
  };
};

const getMockGenres = (): Genre[] => {
  return [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ];
};

const getMockVideos = (movieId: number) => {
  return {
    id: movieId,
    results: [
      {
        id: 'demo-video-1',
        key: 'dQw4w9WgXcQ', // Never Gonna Give You Up as placeholder
        name: 'Demo Trailer',
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      }
    ]
  };
};

export const fetchPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  try {
    // Handle missing or placeholder API key
    if (!API_KEY || API_KEY === '3e12345678901234567890abcdefghij' || API_KEY === '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p') {
      console.log('Using mock data: Missing or demo API key detected');
      // Return mock data for demo purposes when API key is missing
      return getMockPopularMovies(page);
    }
    
    console.log(`Fetching from TMDb API: ${BASE_URL}/movie/popular?api_key=****&page=${page}`);
    const response = await axios.get<MovieResponse>(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
      { timeout: 10000 } // 10 second timeout
    );
    
    if (!response.data || !response.data.results) {
      console.error('Invalid response format from TMDb API');
      return getMockPopularMovies(page);
    }
    
    console.log(`TMDb API returned ${response.data.results.length} movies`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.error('TMDb API unauthorized access. Your API key is invalid or expired.');
      // Use mock data if API key is invalid
      return getMockPopularMovies(page);
    }
    console.error('Error fetching popular movies:', error);
    // Always return mock data on error to prevent breaking the UI
    return getMockPopularMovies(page);
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  try {
    // Handle missing or placeholder API key (include the new placeholder)
    if (!API_KEY || API_KEY === '3e12345678901234567890abcdefghij' || API_KEY === '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p') {
      console.log(`Using mock search data: Missing or demo API key detected for query "${query}"`);
      // Return mock search results when API key is missing
      return getMockSearchResults(query, page);
    }
    
    console.log(`Searching TMDb API for "${query}", page ${page}`);
    const response = await axios.get<MovieResponse>(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
      { timeout: 10000 } // 10 second timeout
    );
    
    if (!response.data || !response.data.results) {
      console.error('Invalid response format from TMDb API for search query');
      return getMockSearchResults(query, page);
    }
    
    console.log(`TMDb API search returned ${response.data.results.length} results for "${query}"`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.error('TMDb API unauthorized access. Your API key is invalid or expired.');
      // Return mock search results if API key is invalid
      return getMockSearchResults(query, page);
    }
    console.error('Error searching movies:', error);
    // Always return mock data on error to prevent breaking the UI
    return getMockSearchResults(query, page);
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  try {
    if (!API_KEY || API_KEY === '3e12345678901234567890abcdefghij') {
      console.error('Invalid or missing TMDb API key. Using demo data for movie details.');
      // Return mock movie details when API key is missing
      return getMockMovieDetails(id);
    }
    
    const response = await axios.get<Movie>(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.error('TMDb API unauthorized access. Your API key is invalid or expired.');
      // Use mock data if API key is invalid
      return getMockMovieDetails(id);
    }
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw new Error('Failed to fetch movie details. Please check your internet connection and try again.');
  }
};

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    if (!API_KEY || API_KEY === '3e12345678901234567890abcdefghij') {
      console.error('Invalid or missing TMDb API key. Using demo data for genres.');
      // Return mock genres when API key is missing
      return getMockGenres();
    }
    
    const response = await axios.get<GenreResponse>(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return response.data.genres;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.error('TMDb API unauthorized access. Your API key is invalid or expired.');
      // Use mock data if API key is invalid
      return getMockGenres();
    }
    console.error('Error fetching genres:', error);
    throw new Error('Failed to fetch genres. Please check your internet connection and try again.');
  }
};

export const fetchMovieVideos = async (movieId: number): Promise<any> => {
  try {
    if (!API_KEY || API_KEY === '3e12345678901234567890abcdefghij') {
      console.error('Invalid or missing TMDb API key. Using demo data for movie videos.');
      // Return mock videos when API key is missing
      return getMockVideos(movieId);
    }
    
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.error('TMDb API unauthorized access. Your API key is invalid or expired.');
      // Use mock data if API key is invalid
      return getMockVideos(movieId);
    }
    console.error(`Error fetching videos for movie ${movieId}:`, error);
    throw new Error('Failed to fetch movie videos. Please check your internet connection and try again.');
  }
};
