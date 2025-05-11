"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGenres = exports.fetchMovieDetails = exports.searchMovies = exports.fetchPopularMovies = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_KEY = process.env.MOVIE_API_KEY;
const BASE_URL = process.env.MOVIE_API_BASE_URL;
const fetchPopularMovies = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1) {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching popular movies:', error);
        throw new Error('Failed to fetch popular movies');
    }
});
exports.fetchPopularMovies = fetchPopularMovies;
const searchMovies = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1) {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
        return response.data;
    }
    catch (error) {
        console.error('Error searching movies:', error);
        throw new Error('Failed to search movies');
    }
});
exports.searchMovies = searchMovies;
const fetchMovieDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching movie details for ID ${id}:`, error);
        throw new Error('Failed to fetch movie details');
    }
});
exports.fetchMovieDetails = fetchMovieDetails;
const fetchGenres = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        return response.data.genres;
    }
    catch (error) {
        console.error('Error fetching genres:', error);
        throw new Error('Failed to fetch genres');
    }
});
exports.fetchGenres = fetchGenres;
