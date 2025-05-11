import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';
import config from '../config.json';
import { testApiKey, getApiStatus } from '../utils/apiTester';

const AdminPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // API testing states
  const [apiStatus, setApiStatus] = useState<{
    apiKeyConfigured: boolean;
    serverReachable: boolean;
    message: string;
  } | null>(null);
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [apiTestLoading, setApiTestLoading] = useState(false);
  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const status = await getApiStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Error checking API status:', error);
    }
  };

  const handleTestApiKey = async () => {
    try {
      setApiTestLoading(true);
      setApiTestResult(null);
      
      const result = await testApiKey();
      setApiTestResult(result);
    } catch (error: any) {
      setApiTestResult({
        success: false,
        message: `Error testing API key: ${error.message}`
      });
    } finally {
      setApiTestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('API Key is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await axios.put(`${config.API_BASE_URL}/config/api-key`, { apiKey });
      
      setSuccess(true);
      
      // Test the newly updated API key
      setTimeout(() => {
        handleTestApiKey();
        checkApiStatus();
      }, 1000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating API key:', error);
      setError('Failed to update API key. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Administrator Settings
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Update TMDb API Key
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph>
            To use the application, you need a valid API key from The Movie Database (TMDb). 
            You can get a free API key by creating an account at{' '}
            <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
              https://www.themoviedb.org/settings/api
            </a>.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              API Key updated successfully!
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="TMDb API Key"
              variant="outlined"
              fullWidth
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              sx={{ mb: 3 }}
              placeholder="Enter your TMDb API key"
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update API Key'}
            </Button>
          </form>
        </Box>        
        <Box sx={{ mt: 5 }}>
          <Divider sx={{ mb: 4 }} />
          
          <Typography variant="h6" gutterBottom>
            API Connection Test
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph>
            Use this section to test your API key and verify that the connection to the TMDb API is working correctly.          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
            <Box>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    API Status
                  </Typography>
                  
                  {apiStatus ? (
                    <>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                          Server Reachable: {' '}
                          <strong style={{ color: apiStatus.serverReachable ? 'green' : 'red' }}>
                            {apiStatus.serverReachable ? 'Yes' : 'No'}
                          </strong>
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body1">
                          API Key Configured: {' '}
                          <strong style={{ color: apiStatus.apiKeyConfigured ? 'green' : 'red' }}>
                            {apiStatus.apiKeyConfigured ? 'Yes' : 'No'}
                          </strong>
                        </Typography>
                      </Box>
                      
                      {apiStatus.message && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                          {apiStatus.message}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        Checking API status...
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={checkApiStatus}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Refresh Status
                  </Button>
                </CardContent>
              </Card>
            </Box>
            
            <Box>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Test API Key
                  </Typography>
                  
                  {apiTestResult && (
                    <Alert 
                      severity={apiTestResult.success ? "success" : "error"} 
                      sx={{ mb: 2 }}
                    >
                      {apiTestResult.message}
                    </Alert>
                  )}
                  
                  <Typography variant="body2" paragraph>
                    Click the button below to test if your TMDb API key is working correctly. This will attempt to make a real request to the TMDb API.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleTestApiKey}
                    disabled={apiTestLoading}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {apiTestLoading ? <CircularProgress size={24} /> : 'Test API Key'}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPage;
