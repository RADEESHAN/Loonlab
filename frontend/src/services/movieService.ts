import axios from 'axios';
import config from '../config.json';
import { MovieResponse, Movie, Genre, MovieVideo } from '../types/movie';

const API_URL = config.API_BASE_URL;

export const getPopularMovies = async (page = 1): Promise<MovieResponse> => {
  try {
    console.log(`Fetching popular movies from: ${API_URL}/movies/popular?page=${page}`);
    const response = await axios.get(`${API_URL}/movies/popular?page=${page}`, {
      // Set a longer timeout for slow connections
      timeout: 10000
    });
    if (response.data && response.data.results && response.data.results.length === 0) {
      console.warn('API returned empty results array for popular movies');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error fetching popular movies:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        throw new Error('Invalid API key. Please go to Admin page to set up a valid TMDb API key.');
      } else if (error.response.status === 404) {
        throw new Error('Movie data not found. Please try again later.');
      } else {
        throw new Error(`Server error: ${error.response.data?.message || 'Failed to fetch popular movies'}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The server might be experiencing high load. Please try again later.');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check if the backend server is running and accessible.');
    } else {
      // Something happened in setting up the request
      throw new Error('Failed to fetch popular movies. Please try again later.');
    }
  }
};

export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  try {
    console.log(`Searching for movies matching "${query}" on page ${page}`);
    const response = await axios.get(
      `${API_URL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`,
      { timeout: 10000 } // 10 second timeout
    );
    
    if (response.data && response.data.results && response.data.results.length === 0 && page === 1) {
      console.warn(`No search results found for query "${query}"`);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error searching movies:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        throw new Error('Invalid API key. Please go to Admin page to set up a valid TMDb API key.');
      } else if (error.response.status === 404) {
        throw new Error('Search results not found. Please try different keywords.');
      } else {
        throw new Error(`Server error: ${error.response.data?.message || 'Failed to search movies'}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Search request timed out. The server might be experiencing high load. Please try again later.');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Cannot connect to movie service. Please check if the backend server is running (http://localhost:5000).');
    } else {
      // Something happened in setting up the request
      throw new Error('Failed to search movies. Please try again with different keywords or check your internet connection.');
    }
  }
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid API key. Please go to Admin page to set up a valid TMDb API key.');
      } else if (error.response.status === 404) {
        throw new Error(`Movie with ID ${id} not found. It may have been removed.`);
      } else {
        throw new Error(`Server error: ${error.response.data.message || 'Failed to fetch movie details'}`);
      }
    } else if (error.request) {
      throw new Error('No response from server. Please check your internet connection and try again.');
    } else {
      throw new Error('Failed to fetch movie details. Please try again later.');
    }
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get(`${API_URL}/movies/genres/all`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching genres:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid API key. Please go to Admin page to set up a valid TMDb API key.');
      } else {
        throw new Error(`Server error: ${error.response.data?.message || 'Failed to fetch genres'}`);
      }
    } else if (error.request) {
      throw new Error('No response from server. Please check your internet connection and try again.');
    } else {
      throw new Error('Failed to fetch genres. Please try again later.');
    }
  }
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching movie by ID ${id}:`, error);
    
    // Log specific error information but return null to avoid breaking UI flows
    if (error.response) {
      console.error(`Server responded with status ${error.response.status}`);
      if (error.response.data?.message) {
        console.error(`Error message: ${error.response.data.message}`);
      }
    }
    return null;
  }
};

export const getMovieVideos = async (movieId: number): Promise<MovieVideo[]> => {
  try {
    const response = await axios.get(`${API_URL}/movies/${movieId}/videos`);
    return response.data.results || [];
  } catch (error: any) {
    console.error(`Error fetching videos for movie ${movieId}:`, error);
    
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Invalid API key. Videos cannot be loaded.');
      } else if (error.response.status === 404) {
        console.error(`No videos found for movie ${movieId}`);
      }
    } else if (error.request) {
      console.error('No response received when fetching videos');
    }
    
    // Return empty array to avoid breaking UI flows
    return [];
  }
};
