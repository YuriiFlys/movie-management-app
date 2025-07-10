import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { movieService } from '@/services/movieService';
import { convertApiMovieToMovie } from '@/utils/movieHelpers';
import { Movie, MovieFilters, SortOptions } from '@/types/movie';
import { MoviesState } from '@/types/store';

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  selectedMovie: null,
  filters: {},
  sortOptions: { field: 'title', direction: 'asc' },
  searchResults: [],
  isSearching: false,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (
    params: {
      sort?: 'id' | 'title' | 'year';
      order?: 'ASC' | 'DESC';
      limit?: number;
      offset?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await movieService.getMovies(params);

      if (response.status !== 1) {
        throw new Error('Failed to fetch movies');
      }

      return response.data.map(convertApiMovieToMovie);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.code || error.message || 'Failed to fetch movies';
      return rejectWithValue(errorMessage);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie | null>) => {
      state.selectedMovie = action.payload;
    },
    setFilters: (state, action: PayloadAction<MovieFilters>) => {
      state.filters = action.payload;
    },
    setSortOptions: (state, action: PayloadAction<SortOptions>) => {
      state.sortOptions = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedMovie,
  setFilters,
  setSortOptions,
  clearError,
} = moviesSlice.actions;

export default moviesSlice.reducer;