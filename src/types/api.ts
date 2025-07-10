export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface FileImportResponse {
    success: boolean;
    imported: number;
    failed: number;
    errors?: string[];
}
