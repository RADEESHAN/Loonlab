import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Link as MuiLink,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      console.log('Submitting login form with:', { email, password });
      await login({ email, password });
      // If we get here, login was successful
      console.log('Login successful, redirecting to home');
    } catch (err: any) {
      console.error('Login submission error:', err);
      setFormError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3}
        sx={{ 
          mt: 8, 
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Sign In
        </Typography>
        
        {(error || formError) && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {formError || error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In          </Button>
            <Grid container justifyContent="flex-end">
            <Grid size={{ xs: 12, sm: 12 }}>
              <MuiLink onClick={() => navigate('/register')} variant="body2" sx={{ cursor: 'pointer' }}>
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
