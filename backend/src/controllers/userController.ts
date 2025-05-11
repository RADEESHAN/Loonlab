import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Invalid registration data - missing fields');
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      console.log('User already exists:', { email, username });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        token: generateToken(user._id.toString()),
      };
      
      console.log('User registered successfully:', { id: user._id, email: user.email });
      res.status(201).json(userData);
    } else {
      console.log('Failed to create user with data:', { username, email });
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Invalid login data - missing fields');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
      token: generateToken(user._id.toString()),
    };

    console.log('User logged in successfully:', { id: user._id, email: user.email });
    res.json(userData);
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add movie to favorites
// @route   POST /api/users/favorites
// @access  Private
export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movie is already in favorites
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    user.favorites.push(movieId);
    await user.save();

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error in addToFavorites:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/users/favorites/:id
// @access  Private
export const removeFromFavorites = async (req: Request, res: Response) => {
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
    console.error('Error in removeFromFavorites:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error in getFavorites:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
