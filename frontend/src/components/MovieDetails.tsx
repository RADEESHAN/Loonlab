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
  CircularProgress,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Movie, Genre, MovieVideo } from '../types/movie';
import { getGenres, getMovieVideos } from '../services/movieService';

interface MovieDetailsProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, open, onClose }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [genreData, videoData] = await Promise.all([
          getGenres(),
          movie ? getMovieVideos(movie.id) : Promise.resolve([])
        ]);
        setGenres(genreData);
        setVideos(videoData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch movie data:', error);
        setLoading(false);
      }
    };

    if (open && movie) {
      fetchData();
      setSelectedVideo(null);
    }
  }, [open, movie]);

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
              
              {/* Movie Trailer Section */}
              {videos && videos.length > 0 && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>Trailer</Typography>
                  {selectedVideo ? (
                    <Box
                      sx={{
                        position: 'relative',
                        paddingBottom: '56.25%', /* 16:9 aspect ratio */
                        height: 0,
                        overflow: 'hidden',
                        maxWidth: '100%',
                        mb: 2,
                      }}
                    >
                      <iframe
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                        }}
                        src={`https://www.youtube.com/embed/${selectedVideo}`}
                        title={`${movie.title} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </Box>
                  ) : (
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {videos
                        .filter(video => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type))
                        .slice(0, 3)
                        .map(video => (
                          <Button
                            key={video.id}
                            variant="outlined"
                            color="secondary"
                            startIcon={<PlayArrowIcon />}
                            onClick={() => setSelectedVideo(video.key)}
                          >
                            {video.name.length > 20 ? `${video.name.substring(0, 20)}...` : video.name}
                          </Button>
                        ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* Trailer Section */}
              {videos.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Trailer</Typography>
                  {videos.filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))[0] ? (
                    <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', mt: 2 }}>
                      <iframe
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
                        src={`https://www.youtube.com/embed/${videos.filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))[0].key}`}
                        title={`${movie.title} trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" mt={2}>
                      <PlayArrowIcon color="disabled" sx={{ mr: 1 }} />
                      <Typography color="textSecondary">No trailer available</Typography>
                    </Box>
                  )}
                </>
              )}
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
