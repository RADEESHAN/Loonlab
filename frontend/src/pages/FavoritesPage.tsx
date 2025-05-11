import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Paper,
  // Remove unused import
  // CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import { Movie } from '../types/movie';
import { getMovieById } from '../services/movieService';
import Loading from '../components/Loading';

const FavoritesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.favorites.length) {
          setFavoriteMovies([]);
          setLoading(false);
          return;
        }

        // Fetch details for each favorite movie
        const moviePromises = user.favorites.map(id => getMovieById(id));
        const movies = await Promise.all(moviePromises);
        
        setFavoriteMovies(movies.filter(movie => movie !== null) as Movie[]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch favorite movies:', error);
        setError('Failed to load favorite movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [user]);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          My Favorite Movies
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}      {loading ? (
        <Loading />      ) : favoriteMovies.length > 0 ? (        <Grid container spacing={3}>
          {favoriteMovies.map((movie) => (
            <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
              <MovieCard movie={movie} onSelect={handleMovieSelect} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Alert severity="info">You haven't added any favorite movies yet.</Alert>
        </Box>
      )}

      <MovieDetails
        movie={selectedMovie}
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </Container>
  );
};

export default FavoritesPage;
