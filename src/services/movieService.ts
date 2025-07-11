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
    format?: string;
  }): Promise<MovieListApiResponse & { total?: number }> {
    const cleanParams: any = {};
    
    if (params?.sort) cleanParams.sort = params.sort;
    if (params?.order) cleanParams.order = params.order;
    if (params?.limit !== undefined) cleanParams.limit = params.limit;
    if (params?.offset !== undefined) cleanParams.offset = params.offset;
    if (params?.actor) cleanParams.actor = params.actor;
    if (params?.title) cleanParams.title = params.title;
    if (params?.search) cleanParams.search = params.search;
    if (params?.format) cleanParams.format = params.format;

    const response = await apiClient.get('/movies', { params: cleanParams });
        
    const result = response.data;
    
    if (result.meta?.total !== undefined) {
      result.total = result.meta.total;
    } else if (response.headers['x-total-count']) {
      result.total = parseInt(response.headers['x-total-count']);
    } else {
      result.total = result.data?.length || 0;
    }
    
    return result;
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
    return { status: response.status };
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

  async searchByTitle(title: string, options?: {
    limit?: number;
    offset?: number;
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
  }) {
    return this.getMovies({
      title,
      search: title,
      ...options
    });
  },

  async searchByActor(actor: string, options?: {
    limit?: number;
    offset?: number;
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
  }) {
    return this.getMovies({
      actor,
      search: actor,
      ...options
    });
  },

  async advancedSearch(searchParams: {
    title?: string;
    actor?: string;
    search?: string;
    format?: string;
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }) {
    return this.getMovies(searchParams);
  },

  validateMovieData(data: MovieCreateRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!data.year || data.year < 1800 || data.year > new Date().getFullYear() + 5) {
      errors.push('Valid year is required (1800 - current year + 5)');
    }

    if (!data.format || !['VHS', 'DVD', 'Blu-Ray'].includes(data.format)) {
      errors.push('Valid format is required (VHS, DVD, or Blu-Ray)');
    }

    if (data.actors && !Array.isArray(data.actors)) {
      errors.push('Actors must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

};