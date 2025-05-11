import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  CardActions,
  Rating,
  Box,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Movie } from '../types/movie';
import { useAuth } from '../contexts/AuthContext';
import Shimmer from './Shimmer';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { user, isAuthenticated, addToFavorites, removeFromFavorites } = useAuth();
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image+Available';

  const handleImageError = () => {
    console.error(`Failed to load image for movie: ${movie.title}`);
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  const getReleaseYear = () => {
    if (!movie.release_date) return 'Unknown';
    try {
      return new Date(movie.release_date).getFullYear();
    } catch (error) {
      console.error(`Invalid release date format for movie: ${movie.title}`, error);
      return 'Unknown';
    }
  };
  
  const isFavorite = () => {
    return isAuthenticated && user?.favorites?.includes(movie.id);
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!isAuthenticated) return;
    
    if (isFavorite()) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>      <CardActionArea onClick={() => onSelect(movie)}>
        {imageLoading && (
          <Box 
            sx={{ 
              height: 450, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Shimmer height={450} />
            <Box 
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <CircularProgress size={40} color="secondary" />
            </Box>
          </Box>
        )}
        <CardMedia
          component="img"
          height="450"
          image={imageError ? 'https://via.placeholder.com/300x450?text=No+Image+Available' : posterUrl}
          alt={movie.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          sx={{ display: imageLoading ? 'none' : 'block' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getReleaseYear()}
          </Typography>
        </CardContent>
      </CardActionArea>      <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>            <Rating 
              name="read-only" 
              value={movie.vote_average ? movie.vote_average / 2 : 0} 
              precision={0.1} 
              readOnly 
              size="small" 
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}/10
            </Typography>
          </Box>
          
          {isAuthenticated && (
            <Tooltip title={isFavorite() ? "Remove from favorites" : "Add to favorites"}>
              <IconButton 
                onClick={handleFavoriteClick}
                color={isFavorite() ? "secondary" : "default"}
                size="small"
              >
                {isFavorite() ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
