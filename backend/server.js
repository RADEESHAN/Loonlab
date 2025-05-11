// Simple Express server for User Authentication and Movie API
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');
console.log('MOVIE_API_KEY:', process.env.MOVIE_API_KEY ? 'Defined' : 'Undefined');
console.log('MOVIE_API_BASE_URL:', process.env.MOVIE_API_BASE_URL ? 'Defined' : 'Undefined');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Defined' : 'Undefined');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: { type: [Number], default: [] },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

// Auth middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// API Routes
// Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ username, email, password });
    
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// User Profile
app.get('/api/users/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Error in profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Favorites Routes
// Get all favorites
app.get('/api/users/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add movie to favorites
app.post('/api/users/favorites', protect, async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }
    
    user.favorites.push(movieId);
    await user.save();
    
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Remove movie from favorites
app.delete('/api/users/favorites/:id', protect, async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.favorites = user.favorites.filter(id => id !== movieId);
    await user.save();
    
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Movie API Routes - Simple proxy to TMDB API
const axios = require('axios');
const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = process.env.MOVIE_API_BASE_URL;

// Get popular movies
app.get('/api/movies/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        page
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
});

// Search movies
app.get('/api/movies/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
});

// Get movie details
app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching movie details for ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

// Get all genres
app.get('/api/movies/genres/all', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    res.json(response.data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
