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
exports.getFavorites = exports.removeFromFavorites = exports.addToFavorites = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
// Generate JWT Token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const userExists = yield user_1.default.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = yield user_1.default.create({
            username,
            email,
            password,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                favorites: user.favorites,
                token: generateToken(user._id.toString()),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.registerUser = registerUser;
// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check for user email
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Check if password matches
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            favorites: user.favorites,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.loginUser = loginUser;
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            favorites: user.favorites,
        });
    }
    catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getUserProfile = getUserProfile;
// @desc    Add movie to favorites
// @route   POST /api/users/favorites
// @access  Private
const addToFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.body;
        if (!movieId) {
            return res.status(400).json({ message: 'Movie ID is required' });
        }
        const user = yield user_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if movie is already in favorites
        if (user.favorites.includes(movieId)) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }
        user.favorites.push(movieId);
        yield user.save();
        res.json({ favorites: user.favorites });
    }
    catch (error) {
        console.error('Error in addToFavorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.addToFavorites = addToFavorites;
// @desc    Remove movie from favorites
// @route   DELETE /api/users/favorites/:id
// @access  Private
const removeFromFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = parseInt(req.params.id);
        const user = yield user_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.favorites = user.favorites.filter(id => id !== movieId);
        yield user.save();
        res.json({ favorites: user.favorites });
    }
    catch (error) {
        console.error('Error in removeFromFavorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.removeFromFavorites = removeFromFavorites;
// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ favorites: user.favorites });
    }
    catch (error) {
        console.error('Error in getFavorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getFavorites = getFavorites;
