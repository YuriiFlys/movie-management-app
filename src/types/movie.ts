export interface Movie {
    id: string;
    title: string;
    year: number;
    format: MovieFormat;
    actors: string[];
    createdAt?: string;
    updatedAt?: string;
}

export enum MovieFormat {
    VHS = 'VHS',
    DVD = 'DVD',
    BLURAY = 'Blu-Ray'
}

export interface MovieFormData {
    title: string;
    year: number;
    format: MovieFormat;
    actors: string[];
}

export interface MovieFilters {
    searchQuery?: string;
    actorName?: string;
    format?: MovieFormat;
}

export interface SortOptions {
    field: 'title' | 'year';
    direction: 'asc' | 'desc';
}

export interface ApiMovie {
    id: number;
    title: string;
    year: number;
    format: string;
    actors: Array<{
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
    }> | string[];
    createdAt: string;
    updatedAt: string;
}

export interface MovieListApiResponse {
    data: ApiMovie[];
    meta: {
        total: number;
    };
    status: number;
}

export interface MovieApiResponse {
    data: ApiMovie;
    status: number;
}

export interface MovieCreateRequest {
    title: string;
    year: number;
    format: string;
    actors: string[];
}

export interface MovieUpdateRequest {
    title?: string;
    year?: number;
    format?: string;
    actors?: string[];
}

export interface MovieImportApiResponse {
    data: ApiMovie[];
    meta: {
        imported: number;
        total: number;
    };
    status: number;
}