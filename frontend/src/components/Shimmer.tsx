import React from 'react';
import { Box, keyframes } from '@mui/material';

interface ShimmerProps {
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle';
}

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const Shimmer: React.FC<ShimmerProps> = ({ 
  width = '100%', 
  height = '100%',
  variant = 'rect'
}) => {
  return (
    <Box
      sx={{
        width,
        height,
        background: 'linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%)',
        backgroundSize: '800px 104px',
        animation: `${shimmer} 1.5s infinite linear`,
        borderRadius: variant === 'circle' ? '50%' : '4px',
        display: 'inline-block'
      }}
    />
  );
};

export default Shimmer;
