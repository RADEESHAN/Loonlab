// This utility helps to test if the TMDb API key is configured correctly
import axios from 'axios';
import config from '../config.json';

const API_URL = config.API_BASE_URL;

/**
 * Tests if the configured TMDb API key is working properly
 * @returns {Promise<{success: boolean, message: string}>} Result of the API test
 */
export const testApiKey = async (): Promise<{success: boolean; message: string}> => {
  try {
    // Make a simple request to get configuration data
    const response = await axios.get(`${API_URL}/movies/config/test`);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        message: 'API key is valid and working correctly!'
      };
    } else {
      return {
        success: false,
        message: 'API responded but may not be configured correctly. Please check your API key.'
      };
    }
  } catch (error: any) {
    console.error('API test failed:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        return {
          success: false,
          message: 'Invalid API key. Please update your TMDb API key in the Admin page.'
        };
      } else if (error.response.status === 404) {
        return {
          success: false,
          message: 'API endpoint not found. The backend services may not be running.'
        };
      } else {
        return {
          success: false,
          message: `Server error: ${error.response.data?.message || error.response.statusText}`
        };
      }
    } else if (error.request) {
      return {
        success: false,
        message: 'No response from server. Please check if the backend is running and accessible.'
      };
    } else {
      return {
        success: false,
        message: `Error setting up the request: ${error.message}`
      };
    }
  }
};

/**
 * Gets information about the current API configuration
 */
export const getApiStatus = async (): Promise<{
  apiKeyConfigured: boolean;
  serverReachable: boolean;
  message: string;
}> => {
  try {
    const response = await axios.get(`${API_URL}/movies/config/status`);
    return {
      apiKeyConfigured: response.data.apiKeyConfigured || false,
      serverReachable: true,
      message: response.data.message || 'API status checked successfully'
    };
  } catch (error: any) {
    console.error('API status check failed:', error);
    
    if (error.response) {
      return {
        apiKeyConfigured: false,
        serverReachable: true,
        message: `Server responded with error: ${error.response.status} - ${error.response.statusText}`
      };
    } else {
      return {
        apiKeyConfigured: false,
        serverReachable: false,
        message: 'Cannot reach API server. Please check if the backend is running.'
      };
    }
  }
};
