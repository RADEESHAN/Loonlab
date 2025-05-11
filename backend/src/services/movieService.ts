import axios from 'axios';
import dotenv from 'dotenv';
import { Movie, MovieResponse, Genre, GenreResponse } from '../models/movie';

dotenv.config();

const API_KEY = process.env.MOVIE_API_KEY;
const BASE_URL = process.env.MOVIE_API_BASE_URL;

export const fetchPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw new Error('Failed to fetch popular movies');
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await axios.get<Movie>(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    throw new Error('Failed to fetch movie details');
  }
};

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get<GenreResponse>(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw new Error('Failed to fetch genres');
  }
};
