import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Pagination,
  Alert,
  Paper,
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
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let response: MovieResponse;

        if (searchActive && searchFilters && searchFilters.query) {
          response = await searchMovies(searchFilters.query, currentPage);
        } else {
          response = await getPopularMovies(currentPage);
        }

        setMovies(response.results);
        setTotalPages(response.total_pages > 500 ? 500 : response.total_pages); // API limits to 500 pages
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, searchActive, searchFilters]);

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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Movie Explorer
        </Typography>
        <SearchBar onSearch={handleSearch} />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        {searchActive ? 'Search Results' : 'Popular Movies'}
      </Typography>

      {loading ? (
        <Loading />      ) : movies.length > 0 ? (        <>          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
                <MovieCard movie={movie} onSelect={handleMovieSelect} />
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={5} mb={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
              size="large"
            />
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
