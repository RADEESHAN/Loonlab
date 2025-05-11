import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Grid
} from '@mui/material';

import { Genre, SearchFilters } from '../types/movie';
import { getGenres } from '../services/movieService';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleSearch = () => {
    const filters: SearchFilters = {
      query,
      genres: selectedGenres,
      year,
      sortBy
    };
    onSearch(filters);
  };

  const handleGenreChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedGenres(
      typeof value === 'string' ? value.split(',').map(Number) : value
    );
  };

  return (
    <Box sx={{ mb: 4 }}>      <Grid container spacing={2}>        <Grid size={12}>
          <TextField
            fullWidth
            label="Search Movies"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </Grid>        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="genre-label">Genres</InputLabel>
            <Select
              labelId="genre-label"
              multiple
              value={selectedGenres}
              onChange={handleGenreChange}
              input={<OutlinedInput label="Genres" />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return 'All Genres';
                }
                return selected.join(', ');
              }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Year"
            variant="outlined"
            placeholder="e.g. 2023"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="popularity.desc">Popularity (High to Low)</MenuItem>
              <MenuItem value="popularity.asc">Popularity (Low to High)</MenuItem>
              <MenuItem value="vote_average.desc">Rating (High to Low)</MenuItem>
              <MenuItem value="vote_average.asc">Rating (Low to High)</MenuItem>
              <MenuItem value="release_date.desc">Release Date (Newest)</MenuItem>
              <MenuItem value="release_date.asc">Release Date (Oldest)</MenuItem>
            </Select>
          </FormControl>
        </Grid>        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBar;
