import axios from 'axios';
import config from '../config.json';
import { MovieResponse, Movie, Genre } from '../types/movie';

const API_URL = config.API_BASE_URL;

export const getPopularMovies = async (page = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get(`${API_URL}/movies/popular?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw new Error('Failed to fetch popular movies');
  }
};

export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get(`${API_URL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw new Error('Failed to fetch movie details');
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get(`${API_URL}/movies/genres/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw new Error('Failed to fetch genres');
  }
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie by ID ${id}:`, error);
    return null;
  }
};
