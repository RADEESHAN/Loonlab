import React from 'react';
import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';

interface LoadingProps {
  message?: string;
  type?: 'full' | 'inline' | 'linear';
  small?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  type = 'full',
  small = false 
}) => {
  if (type === 'linear') {
    return (
      <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
        <LinearProgress color="secondary" />
        {message && (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }
  
  if (type === 'inline') {
    return (
      <Box 
        display="flex" 
        flexDirection="row"
        justifyContent="center" 
        alignItems="center" 
        p={2}
      >
        <CircularProgress size={small ? 20 : 30} thickness={4} />
        {message && (
          <Typography variant={small ? "body2" : "body1"} sx={{ ml: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }
  
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight={small ? "100px" : "200px"}
      p={4}
    >
      <CircularProgress size={small ? 40 : 60} thickness={4} />
      {message && (
        <Typography variant={small ? "body1" : "h6"} sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;
