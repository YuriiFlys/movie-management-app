import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { movieService } from '@/services/movieService';
import { convertApiMovieToMovie } from '@/utils/movieHelpers';
import { Movie, MovieFilters, SortOptions, MovieCreateRequest } from '@/types/movie';
import { MoviesState } from '@/types/store';

const initialState: MoviesState = {
  movies: [],
  moviesLoading: false,
  moviesError: null,
  selectedMovie: null,
  selectedMovieLoading: false,
  selectedMovieError: null,
  createMovieLoading: false,
  createMovieError: null,
  updateMovieLoading: false,
  updateMovieError: null,
  deleteMovieLoading: false,
  deleteMovieError: null,
  isInitialized: false,
  filters: {},
  sortOptions: { field: 'title', direction: 'asc' },
  isImporting: false,
  importProgress: null,
  currentQuery: {},
  totalMovies: 0,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (
    params: {
      sort?: 'id' | 'title' | 'year';
      order?: 'ASC' | 'DESC';
      limit?: number;
      offset?: number;
      actor?: string;
      title?: string;
      search?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await movieService.getMovies(params);

      if (response.status !== 1) {
        throw new Error('Failed to fetch movies');
      }

      return {
        movies: response.data.map(convertApiMovieToMovie),
        total: response.total || response.data.length,
        query: params
      };
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

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData: MovieCreateRequest, { rejectWithValue }) => {
    try {
      const response = await movieService.createMovie(movieData);

      if (response.status !== 1) {
        throw new Error('Failed to create movie');
      }

      return convertApiMovieToMovie(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.code || error.message || 'Failed to create movie';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, data }: { id: string; data: Partial<MovieCreateRequest> }, { rejectWithValue }) => {
    try {
      const response = await movieService.updateMovie(id, data);

      if (response.status !== 1) {
        throw new Error('Failed to update movie');
      }

      return convertApiMovieToMovie(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.code || error.message || 'Failed to update movie';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (movieId: string, { rejectWithValue }) => {
    try {
      const response = await movieService.deleteMovie(movieId);

      if (response.status !== 200) {
        throw new Error('Failed to delete movie');
      }

      return movieId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.code || error.message || 'Failed to delete movie';
      return rejectWithValue(errorMessage);
    }
  }
);

export const importMovies = createAsyncThunk(
  'movies/importMovies',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await movieService.importMovies(file);

      if (response.status !== 1) {
        throw new Error('Failed to import movies');
      }

      return {
        movies: response.data.map(convertApiMovieToMovie),
        meta: response.meta,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.code || error.message || 'Failed to import movies';
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
      state.moviesError = null;
      state.selectedMovieError = null;
      state.createMovieError = null;
      state.updateMovieError = null;
      state.deleteMovieError = null;
      state.isInitialized = false;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
      state.selectedMovieError = null;
    },
    clearCurrentQuery: (state) => {
      state.currentQuery = {};
    },
    setImportProgress: (state, action: PayloadAction<{ total: number; imported: number; failed: number } | null>) => {
      state.importProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.moviesLoading = true;
        state.moviesError = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.moviesLoading = false;
        state.movies = action.payload.movies;
        state.totalMovies = action.payload.total;
        state.currentQuery = action.payload.query;
        state.isInitialized = true;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.moviesLoading = false;
        state.moviesError = action.payload as string;
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
      })

      .addCase(createMovie.pending, (state) => {
        state.createMovieLoading = true;
        state.createMovieError = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.createMovieLoading = false;
        state.movies.unshift(action.payload);
        state.totalMovies += 1;
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.createMovieLoading = false;
        state.createMovieError = action.payload as string;
      })

      .addCase(updateMovie.pending, (state) => {
        state.updateMovieLoading = true;
        state.updateMovieError = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.updateMovieLoading = false;
        const index = state.movies.findIndex(movie => movie.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        if (state.selectedMovie?.id === action.payload.id) {
          state.selectedMovie = action.payload;
        }
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.updateMovieLoading = false;
        state.updateMovieError = action.payload as string;
      })

      .addCase(deleteMovie.pending, (state) => {
        state.deleteMovieLoading = true;
        state.deleteMovieError = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.deleteMovieLoading = false;
        state.movies = state.movies.filter(movie => movie.id !== action.payload);
        state.totalMovies = Math.max(0, state.totalMovies - 1);
        if (state.selectedMovie?.id === action.payload) {
          state.selectedMovie = null;
        }
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.deleteMovieLoading = false;
        state.deleteMovieError = action.payload as string;
      })

      .addCase(importMovies.pending, (state) => {
        state.isImporting = true;
        state.moviesError = null;
        state.importProgress = null;
      })
      .addCase(importMovies.fulfilled, (state, action) => {
        state.isImporting = false;
        state.importProgress = {
          total: action.payload.meta.total,
          imported: action.payload.meta.imported,
          failed: action.payload.meta.total - action.payload.meta.imported,
        };
        action.payload.movies.forEach(movie => {
          const existingIndex = state.movies.findIndex(existing => existing.id === movie.id);
          if (existingIndex === -1) {
            state.movies.push(movie);
            state.totalMovies += 1;
          }
        });
      })
      .addCase(importMovies.rejected, (state, action) => {
        state.isImporting = false;
        state.moviesError = action.payload as string;
      });
  },
});

export const {
  setSelectedMovie,
  setFilters,
  setSortOptions,
  clearError,
  clearSelectedMovie,
  clearCurrentQuery,
  setImportProgress,
} = moviesSlice.actions;

export default moviesSlice.reducer;