import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Updates the TMDb API key in the .env file
 * @route PUT /api/config/api-key
 * @access Admin only (in production this should be protected)
 */
export const updateApiKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      res.status(400).json({ message: 'API key is required' });
      return;
    }

    // Path to the .env file
    const envPath = path.resolve(process.cwd(), '.env');
    
    // Read the current .env file
    let envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Replace the API key
    envContent = envContent.replace(
      /MOVIE_API_KEY=.*/,
      `MOVIE_API_KEY=${apiKey}`
    );
    
    // Write back to the .env file
    fs.writeFileSync(envPath, envContent);
    
    // Update the current environment variable
    process.env.MOVIE_API_KEY = apiKey;
    
    // Reload environment variables
    dotenv.config();
    
    res.status(200).json({ message: 'API key updated successfully' });
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ message: 'Failed to update API key' });
  }
};

/**
 * Gets current config status including API key validity
 * @route GET /api/config/status
 * @access Public
 */
export const getConfigStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = process.env.MOVIE_API_KEY;
    const isPlaceholder = !apiKey || apiKey === '3e12345678901234567890abcdefghij';
    
    res.status(200).json({ 
      apiKeyConfigured: !isPlaceholder,
      apiKeyStatus: isPlaceholder ? 'invalid' : 'valid',
      baseUrl: process.env.MOVIE_API_BASE_URL,
      message: isPlaceholder 
        ? 'API key is not configured or using the placeholder value. Please update it in the Admin page.' 
        : 'API key is configured. You can test it using the Test API button.'
    });
  } catch (error) {
    console.error('Error fetching config status:', error);
    res.status(500).json({ 
      apiKeyConfigured: false,
      message: 'Failed to get config status' 
    });
  }
};

/**
 * Tests if the TMDb API key is working
 * @route GET /api/config/test
 * @access Public
 */
export const testApiKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = process.env.MOVIE_API_KEY;
    
    if (!apiKey || apiKey === '3e12345678901234567890abcdefghij') {
      res.status(401).json({ 
        success: false, 
        message: 'API key is missing or using placeholder value. Please update it in the Admin page.' 
      });
      return;
    }
    
    // Test the API key with a simple request to TMDb API
    const apiBaseUrl = process.env.MOVIE_API_BASE_URL || 'https://api.themoviedb.org/3';
    const testUrl = `${apiBaseUrl}/configuration?api_key=${apiKey}`;
    
    try {
      const axios = require('axios'); // Import axios here to avoid issues if it's not available globally
      const response = await axios.get(testUrl);
      
      if (response.status === 200) {
        res.status(200).json({ 
          success: true, 
          message: 'API key is valid and working correctly!',
          data: {
            images: response.data.images,
            changeKeys: response.data.change_keys?.length || 0
          }
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: 'API key validation failed. Unexpected response.' 
        });
      }
    } catch (apiError: any) {
      if (apiError.response && apiError.response.status === 401) {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid API key. Please check and update it in the Admin page.' 
        });
      } else {
        res.status(500).json({
          success: false,
          message: `Error testing API key: ${apiError.message || 'Unknown error'}`,
        });
      }
    }
  } catch (error: any) {
    console.error('Error in API key test controller:', error);
    res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
};
