import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth token received:', token);

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      console.log('Token decoded successfully:', decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found with token ID:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('User authenticated:', user._id);
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization token found in request');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
