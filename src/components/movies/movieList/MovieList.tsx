import React, { useState, useCallback, useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies';
import Button from '@/components/common/button/Button';
import Modal from '@/components/common/modal/Modal';
import MovieCard from '../movieCard/MovieCard';
import MovieModal from '../movieModal/MovieModal';
import MovieForm from '../movieForm/MovieForm';
import MovieSearch from '../movieSearch/MovieSearch';
import MovieImport from '../movieImport/MovieImport';
import LoadingSpinner from '@/components/common/loadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/common/errorMessage/ErrorMessage';
import EmptyState from '../emptyState/EmptyState';
import { MovieFormat } from '@/types/movie';
import styles from './MovieList.module.css';

const MovieList: React.FC = () => {
    const {
        movies,
        totalMovies,
        moviesLoading,
        moviesError,
        createMovieLoading,
        isSearchActive,
        loadMovies,
        addMovie,
        searchMovies,
        clearSearch,
        clearSelectedMovieData,
        importMoviesFromFile,
        isInitialized,
        getCurrentPage,
        getTotalPages,
        hasNextPage,
        hasPreviousPage,
        loadPage,
        sortMovies,
        currentQuery
    } = useMovies();

    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            loadMovies({ limit: 20, offset: 0, sort: 'title', order: 'ASC' });
        }
    }, [isInitialized, loadMovies]);


    const handleMovieClick = (movieId: string) => {
        setSelectedMovieId(movieId);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = useCallback(() => {
        setIsDetailsModalOpen(false);
        setSelectedMovieId(null);
        clearSelectedMovieData();
    }, [clearSelectedMovieData]);

    const handleAddMovie = useCallback(async (movieData: {
        title: string;
        year: number;
        format: MovieFormat;
        actors: string[];
    }) => {
        const success = await addMovie({
            title: movieData.title,
            year: movieData.year,
            format: movieData.format.toString(),
            actors: movieData.actors,
        });

        if (success) {
            setIsAddModalOpen(false);
        }
    }, [addMovie]);

    const handleSearch = useCallback(async (filters: {
        searchQuery?: string;
        searchType?: 'title' | 'actor' | 'general';
        format?: MovieFormat | '';
    }) => {
        const searchParams: any = {
            limit: 20,
            offset: 0,
            sort: currentQuery.sort || 'title',
            order: currentQuery.order || 'ASC'
        };

        if (filters.format) {
            searchParams.format = filters.format;
        }

        if (filters.searchQuery?.trim()) {
            const trimmed = filters.searchQuery.trim();

            switch (filters.searchType) {
                case 'title':
                    searchParams.title = trimmed;
                    break;
                case 'actor':
                    searchParams.actor = trimmed;
                    break;
                case 'general':
                default:
                    searchParams.search = trimmed;
                    break;
            }
        }

        await searchMovies(searchParams);
    }, [searchMovies, currentQuery.sort, currentQuery.order]);


    const handleClearSearch = useCallback(async () => {
        await clearSearch({
            limit: 20,
            offset: 0,
            sort: 'title',
            order: 'ASC'
        });
    }, [clearSearch]);

    const handleImportMovies = useCallback(async (file: File) => {
        const success = await importMoviesFromFile(file);

        if (success) {
            setIsImportModalOpen(false);
        }
    }, [importMoviesFromFile]);

    const handlePageChange = useCallback(async (page: number) => {
        await loadPage(page);
    }, [loadPage]);

    const handleSortChange = useCallback(async (sort: 'id' | 'title' | 'year', order: 'ASC' | 'DESC') => {
        await sortMovies(sort, order);
    }, [sortMovies]);

    if (moviesLoading && movies.length === 0) {
        return <LoadingSpinner message="Loading movies..." />;
    }

    if (moviesError && movies.length === 0) {
        return (
            <ErrorMessage
                title="Error loading movies"
                message={moviesError}
                onRetry={() => loadMovies({ limit: 20, offset: 0 })}
            />
        );
    }

    const currentPage = getCurrentPage();
    const totalPages = getTotalPages();

    return (
        <div className={styles.container}>
            <MovieSearch
                onSearch={handleSearch}
                onClear={handleClearSearch}
                loading={moviesLoading}
            />

            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>
                        {isSearchActive ? (
                            <>Search Results ({totalMovies})</>
                        ) : (
                            <>Movies ({totalMovies})</>
                        )}
                    </h2>
                    {isSearchActive && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleClearSearch}
                        >
                            Show All Movies
                        </Button>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        Import Movies
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Movie
                    </Button>
                </div>
            </div>

            <div className={styles.sortingControls}>
                <div className={styles.sortGroup}>
                    <label>Sort by:</label>
                    <select
                        value={currentQuery.sort || 'title'}
                        onChange={(e) => handleSortChange(e.target.value as any, currentQuery.order || 'ASC')}
                        className={styles.sortSelect}
                    >
                        <option value="title">Title</option>
                        <option value="year">Year</option>
                        <option value="id">ID</option>
                    </select>
                    <select
                        value={currentQuery.order || 'ASC'}
                        onChange={(e) => handleSortChange(currentQuery.sort || 'title', e.target.value as any)}
                        className={styles.sortSelect}
                    >
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                    </select>
                </div>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <div className={styles.pageInfo}>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <span className={styles.resultsInfo}>
                            ({movies.length} of {totalMovies} results)
                        </span>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!hasPreviousPage()}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!hasNextPage()}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {moviesError && movies.length > 0 && (
                <div className={styles.searchError}>
                    <ErrorMessage
                        title="Operation failed"
                        message={moviesError}
                        showRetry={false}
                    />
                </div>
            )}

            {moviesLoading && (
                <div className={styles.searchLoading}>
                    <LoadingSpinner message="Loading movies..." size="sm" />
                </div>
            )}

            {movies.length === 0 && !moviesLoading ? (
                <EmptyState />
            ) : (
                <div className={styles.grid}>
                    {movies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onMovieClick={handleMovieClick}
                        />
                    ))}
                </div>
            )}

            <MovieModal
                isOpen={isDetailsModalOpen}
                movieId={selectedMovieId}
                onClose={handleCloseDetailsModal}
            />

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Movie"
                size="md"
            >
                <MovieForm
                    onSubmit={handleAddMovie}
                    onCancel={() => setIsAddModalOpen(false)}
                    loading={createMovieLoading}
                />
            </Modal>

            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Import Movies"
                size="lg"
            >
                <MovieImport
                    onImport={handleImportMovies}
                    loading={moviesLoading}
                />
            </Modal>
        </div>
    );
};

export default MovieList;