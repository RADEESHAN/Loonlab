"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenres = exports.getMovieDetails = exports.searchMovies = exports.getPopularMovies = void 0;
const movieService = __importStar(require("../services/movieService"));
const getPopularMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const movies = yield movieService.fetchPopularMovies(page);
        res.status(200).json(movies);
    }
    catch (error) {
        console.error('Error in getPopularMovies controller:', error);
        res.status(500).json({ message: 'Failed to fetch popular movies' });
    }
});
exports.getPopularMovies = getPopularMovies;
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const movies = yield movieService.searchMovies(query, page);
        res.status(200).json(movies);
    }
    catch (error) {
        console.error('Error in searchMovies controller:', error);
        res.status(500).json({ message: 'Failed to search movies' });
    }
});
exports.searchMovies = searchMovies;
const getMovieDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const movieId = parseInt(id);
        if (isNaN(movieId)) {
            return res.status(400).json({ message: 'Valid movie ID is required' });
        }
        const movie = yield movieService.fetchMovieDetails(movieId);
        res.status(200).json(movie);
    }
    catch (error) {
        console.error('Error in getMovieDetails controller:', error);
        res.status(500).json({ message: 'Failed to fetch movie details' });
    }
});
exports.getMovieDetails = getMovieDetails;
const getGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genres = yield movieService.fetchGenres();
        res.status(200).json(genres);
    }
    catch (error) {
        console.error('Error in getGenres controller:', error);
        res.status(500).json({ message: 'Failed to fetch genres' });
    }
});
exports.getGenres = getGenres;
