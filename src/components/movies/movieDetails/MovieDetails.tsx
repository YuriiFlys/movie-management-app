import React, { useEffect } from 'react';
import LoadingSpinner from '@/components/common/loadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/common/errorMessage/ErrorMessage';
import { useMovies } from '@/hooks/useMovies';
import styles from './MovieDetails.module.css';

interface MovieDetailsProps {
    movieId: string;
    onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId }) => {
    const { selectedMovie, loading, error, loadMovieById, clearMoviesError } = useMovies();

    useEffect(() => {
        if (movieId) {
            loadMovieById(movieId);
        }

        return () => {
            clearMoviesError();
        };
    }, [movieId]);

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'Not available';

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const hasDateInfo = selectedMovie && (selectedMovie.createdAt || selectedMovie.updatedAt);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <LoadingSpinner message="Loading movie details..." />
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage
                title="Error loading movie"
                message={error}
                onRetry={() => loadMovieById(movieId)}
                className={styles.errorContainer}
            />
        );
    }

    if (!selectedMovie) {
        return (
            <div className={styles.notFound}>
                <h3>Movie not found</h3>
                <p>The requested movie could not be found.</p>
            </div>
        );
    }

    const getFormatColor = (format: string) => {
        switch (format) {
            case 'VHS': return 'hsl(280, 50%, 50%)';
            case 'DVD': return 'hsl(220, 90%, 55%)';
            case 'Blu-ray': return 'hsl(120, 50%, 45%)';
            default: return 'hsl(220, 10%, 60%)';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>{selectedMovie.title}</h1>
                    <div className={styles.yearAndFormat}>
                        <span className={styles.year}>{selectedMovie.year}</span>
                        <span
                            className={styles.format}
                            style={{ backgroundColor: getFormatColor(selectedMovie.format) }}
                        >
                            {selectedMovie.format}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Actors</h3>
                    {selectedMovie.actors && selectedMovie.actors.length > 0 ? (
                        <div className={styles.actorsList}>
                            {selectedMovie.actors.map((actor, index) => (
                                <span key={index} className={styles.actor}>
                                    {actor}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noData}>No actors listed</p>
                    )}
                </div>

                <div className={styles.metadata}>
                    <h3 className={styles.sectionTitle}>Details</h3>
                    <div className={styles.metadataGrid}>
                        <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Movie ID:</span>
                            <span className={styles.metadataValue}>{selectedMovie.id}</span>
                        </div>

                        <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Release Year:</span>
                            <span className={styles.metadataValue}>{selectedMovie.year}</span>
                        </div>

                        <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Format:</span>
                            <span className={styles.metadataValue}>{selectedMovie.format}</span>
                        </div>

                        {hasDateInfo && (
                            <>
                                <div className={styles.metadataItem}>
                                    <span className={styles.metadataLabel}>Added to Collection:</span>
                                    <span className={styles.metadataValue}>
                                        {formatDate(selectedMovie.createdAt)}
                                    </span>
                                </div>

                                <div className={styles.metadataItem}>
                                    <span className={styles.metadataLabel}>Last Updated:</span>
                                    <span className={styles.metadataValue}>
                                        {formatDate(selectedMovie.updatedAt)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;