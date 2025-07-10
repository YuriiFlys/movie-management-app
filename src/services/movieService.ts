import { apiClient } from './api';
import {
  MovieApiResponse,
  MovieCreateRequest,
  MovieUpdateRequest,
  MovieListApiResponse,
  MovieImportApiResponse,
} from '../types/movie';

export const movieService = {
  async getMovies(params?: {
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
    actor?: string;
    title?: string;
    search?: string;
  }): Promise<MovieListApiResponse> {
    const response = await apiClient.get('/movies', { params });
    return response.data;
  },

  async getMovieById(id: string): Promise<MovieApiResponse> {
    const response = await apiClient.get(`/movies/${id}`);
    return response.data;
  },

  async createMovie(data: MovieCreateRequest): Promise<MovieApiResponse> {
    const response = await apiClient.post('/movies', data);
    return response.data;
  },

  async updateMovie(id: string, data: MovieUpdateRequest): Promise<MovieApiResponse> {
    const response = await apiClient.patch(`/movies/${id}`, data);
    return response.data;
  },

  async deleteMovie(id: string): Promise<{ status: number }> {
    const response = await apiClient.delete(`/movies/${id}`);
    return response.data;
  },

  async importMovies(file: File): Promise<MovieImportApiResponse> {
    const formData = new FormData();
    formData.append('movies', file);

    const response = await apiClient.post('/movies/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async searchMovies(query: {
    actor?: string;
    title?: string;
    search?: string;
  }): Promise<MovieListApiResponse> {
    const response = await apiClient.get('/movies', { params: query });
    return response.data;
  },
};