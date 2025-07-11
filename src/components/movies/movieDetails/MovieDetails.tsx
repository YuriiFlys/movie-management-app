import React, { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/common/loadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/common/errorMessage/ErrorMessage';
import Button from '@/components/common/button/Button';
import Modal from '@/components/common/modal/Modal';
import { useMovies } from '@/hooks/useMovies';
import styles from './MovieDetails.module.css';

interface MovieDetailsProps {
    movieId: string;
    onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId, onClose }) => {
    const { 
        selectedMovie, 
        selectedMovieLoading, 
        selectedMovieError, 
        deleteMovieLoading,
        loadMovieById, 
        removeMovie,
        clearMoviesError 
    } = useMovies();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (movieId) {
            loadMovieById(movieId);
        }

        return () => {
            clearMoviesError();
        };
    }, [movieId]);

    const handleDeleteMovie = async () => {
        if (!selectedMovie) return;

        const success = await removeMovie(selectedMovie.id);
        if (success) {
            setShowDeleteConfirm(false);
            onClose();
        }
    };

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

    if (selectedMovieLoading) {
        return (
            <div className={styles.loadingContainer}>
                <LoadingSpinner message="Loading movie details..." />
            </div>
        );
    }

    if (selectedMovieError) {
        return (
            <ErrorMessage
                title="Error loading movie"
                message={selectedMovieError}
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
            case 'Blu-Ray': return 'hsl(120, 50%, 45%)';
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
                
                <div className={styles.actions}>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={deleteMovieLoading}
                    >
                        {deleteMovieLoading ? 'Deleting...' : 'Delete Movie'}
                    </Button>
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

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Delete"
                size="sm"
            >
                <div className={styles.deleteConfirmContent}>
                    <p className={styles.deleteMessage}>
                        Are you sure you want to delete <strong>"{selectedMovie.title}"</strong>?
                    </p>
                    <p className={styles.deleteWarning}>
                        This action cannot be undone.
                    </p>
                    
                    <div className={styles.deleteActions}>
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={deleteMovieLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteMovie}
                            disabled={deleteMovieLoading}
                        >
                            {deleteMovieLoading ? 'Deleting...' : 'Delete Movie'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MovieDetails;