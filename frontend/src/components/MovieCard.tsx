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
  Tooltip
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Movie } from '../types/movie';
import { useAuth } from '../contexts/AuthContext';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const [imageError, setImageError] = useState(false);
  const { user, isAuthenticated, addToFavorites, removeFromFavorites } = useAuth();
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image+Available';

  const handleImageError = () => {
    setImageError(true);
  };

  const getReleaseYear = () => {
    if (!movie.release_date) return 'Unknown';
    return new Date(movie.release_date).getFullYear();
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
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={() => onSelect(movie)}>
        <CardMedia
          component="img"
          height="450"
          image={imageError ? 'https://via.placeholder.com/300x450?text=No+Image+Available' : posterUrl}
          alt={movie.title}
          onError={handleImageError}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating 
              name="read-only" 
              value={movie.vote_average / 2} 
              precision={0.1} 
              readOnly 
              size="small" 
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {movie.vote_average.toFixed(1)}/10
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
