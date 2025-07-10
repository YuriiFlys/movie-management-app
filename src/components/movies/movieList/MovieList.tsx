import React, { useEffect } from 'react';
import { useMovies } from '@/hooks/useMovies';
import MovieCard from '../movieCard/MovieCard';
import LoadingSpinner from '@/components/common/loadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/common/errorMessage/ErrorMessage';
import EmptyState from '../emptyState/EmptyState';
import styles from './MovieList.module.css';

const MovieList: React.FC = () => {
    const { movies, loading, error, loadMovies } = useMovies();

    useEffect(() => {
        loadMovies();
    }, [loadMovies]);

    if (loading) {
        return <LoadingSpinner message="Loading movies..." />;
    }

    if (error) {
        return (
            <ErrorMessage
                title="Error loading movies"
                message={error}
                onRetry={loadMovies}
            />
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Movies ({movies.length})
                </h2>
            </div>

            {movies.length === 0 ? (
                <EmptyState />
            ) : (
                <div className={styles.grid}>
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;