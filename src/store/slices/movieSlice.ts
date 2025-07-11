import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { movieService } from '@/services/movieService';
import { convertApiMovieToMovie } from '@/utils/movieHelpers';
import { Movie, MovieFilters, SortOptions } from '@/types/movie';

interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  selectedMovie: Movie | null;
  selectedMovieLoading: boolean;
  selectedMovieError: string | null;
  filters: MovieFilters;
  sortOptions: SortOptions;
  searchResults: Movie[];
  isSearching: boolean;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
  selectedMovie: null,
  selectedMovieLoading: false,
  selectedMovieError: null,
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

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (movieId: string, { rejectWithValue }) => {
    try {
      const response = await movieService.getMovieById(movieId);

      if (response.status !== 1) {
        throw new Error('Failed to fetch movie');
      }

      return convertApiMovieToMovie(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.code || error.message || 'Failed to fetch movie';
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
      state.selectedMovieError = null;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
      state.selectedMovieError = null;
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
      })

      .addCase(fetchMovieById.pending, (state) => {
        state.selectedMovieLoading = true;
        state.selectedMovieError = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.selectedMovieLoading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.selectedMovieLoading = false;
        state.selectedMovieError = action.payload as string;
      });
  },
});

export const {
  setSelectedMovie,
  setFilters,
  setSortOptions,
  clearError,
  clearSelectedMovie,
} = moviesSlice.actions;

export default moviesSlice.reducer;