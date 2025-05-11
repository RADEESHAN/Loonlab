import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import { getPopularMovies, searchMovies } from '../services/movieService';
import { Movie, MovieResponse, SearchFilters } from '../types/movie';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import MovieDetails from '../components/MovieDetails';
import Loading from '../components/Loading';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(() => {
    // Initialize from localStorage if available
    const savedSearch = localStorage.getItem('lastSearch');
    return savedSearch ? JSON.parse(savedSearch) : null;
  });  // Initialize search from localStorage
  useEffect(() => {
    if (searchFilters && searchFilters.query) {
      setSearchActive(true);
    }
  }, [searchFilters]);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let response: MovieResponse;

        if (searchActive && searchFilters && searchFilters.query) {
          response = await searchMovies(searchFilters.query, currentPage);
          // Save search to localStorage
          localStorage.setItem('lastSearch', JSON.stringify(searchFilters));
        } else {
          response = await getPopularMovies(currentPage);
        }

        // If currentPage is 1, replace the movies list, otherwise append the new results
        if (currentPage === 1) {
          setMovies(response.results);
        } else {
          setMovies(prevMovies => [...prevMovies, ...response.results]);
        }
        
        setTotalPages(response.total_pages > 500 ? 500 : response.total_pages); // API limits to 500 pages
        setLoading(false);      } catch (error: any) {
        console.error('Failed to fetch movies:', error);
        
        // Set a user-friendly error message
        if (error.message && error.message.includes('API key')) {
          setError('Could not load movies: Invalid API key. Please go to Admin page to set up your TMDb API key.');
        } else if (error.message && error.message.includes('internet connection')) {
          setError('Could not load movies: Please check your internet connection and try again.');
        } else {
          setError(`Failed to load movies: ${error.message || 'Please try again later.'}`);
        }
        
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, searchActive, searchFilters]);

  // Infinite scrolling functionality
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      
      // If we're near the bottom of the page (100px threshold) and not already loading
      const threshold = 100;
      const isNearBottom = windowHeight + scrollTop >= documentHeight - threshold;
      
      if (isNearBottom && !loading && currentPage < totalPages) {
        // Load next page
        setCurrentPage(prevPage => prevPage + 1);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, currentPage, totalPages]);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    setSearchActive(!!filters.query);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  const handleManualLoadMore = async () => {
    try {
      if (currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Failed to load more movies:', error);
      setError('Failed to load more movies. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Movie Explorer
        </Typography>
        <SearchBar onSearch={handleSearch} />
      </Paper>      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Box>
              <Button 
                color="inherit" 
                size="small"
                sx={{ mr: 1 }}
                onClick={() => {
                  setError(null);
                  setCurrentPage(1);
                  // This will trigger the useEffect to fetch movies again
                }}
              >
                Retry
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  window.location.href = '/admin';
                }}
              >
                Go to Admin
              </Button>
            </Box>
          }
        >
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        {searchActive ? 'Search Results' : 'Popular Movies'}
      </Typography>      {loading && currentPage === 1 ? (
        <Loading message="Loading movies..." />
      ) : movies.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
                <MovieCard movie={movie} onSelect={handleMovieSelect} />
              </Grid>
            ))}
          </Grid>          <Box display="flex" flexDirection="column" alignItems="center" mt={5} mb={3}>
            {/* Infinite scroll indicator */}
            {currentPage < totalPages ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Scroll down to load more movies
                </Typography>
                
                {/* Show loading indicator when loading more pages */}
                {loading && currentPage > 1 && (
                  <Loading type="inline" small message="Loading more movies..." />
                )}
                
                {/* Optional: Manual load more button for users who prefer clicking */}
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleManualLoadMore} 
                  size="large"
                  sx={{ mt: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </Button>
                
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Showing {movies.length} of {totalPages * 20} movies
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                You've reached the end of the results!
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <Alert severity="info">No movies found. Try a different search.</Alert>
      )}

      <MovieDetails
        movie={selectedMovie}
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </Container>
  );
};

export default HomePage;
