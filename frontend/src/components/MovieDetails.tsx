import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Grid,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Movie, Genre } from '../types/movie';
import { getGenres } from '../services/movieService';

interface MovieDetailsProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, open, onClose }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const genreData = await getGenres();
        setGenres(genreData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
        setLoading(false);
      }
    };

    if (open) {
      fetchGenres();
    }
  }, [open]);

  if (!movie) {
    return null;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image+Available';

  const getMovieGenres = () => {
    if (!movie.genre_ids || !genres.length) return [];
    return genres.filter(genre => movie.genre_ids.includes(genre.id));
  };

  const movieGenres = getMovieGenres();
  const releaseDate = movie.release_date 
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown release date';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="movie-details-dialog"
    >
      <DialogTitle id="movie-details-dialog">
        {movie.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>        ) : (          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <img 
                src={posterUrl} 
                alt={movie.title} 
                style={{ width: '100%', borderRadius: '8px' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image+Available';
                }}
              />            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box mb={2} display="flex" alignItems="center">
                <Rating 
                  value={movie.vote_average / 2} 
                  precision={0.1} 
                  readOnly 
                  size="large"
                />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {movie.vote_average.toFixed(1)}/10
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Released: {releaseDate}
              </Typography>
              
              <Box mb={2}>
                {movieGenres.map((genre) => (
                  <Chip 
                    key={genre.id} 
                    label={genre.name} 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                ))}
              </Box>
              
              <Typography variant="h6" gutterBottom>Overview</Typography>
              <Typography variant="body1" paragraph>
                {movie.overview || 'No description available.'}
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieDetails;
