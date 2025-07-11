import React from 'react';
import { Movie } from '@/types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
    movie: Movie;
    onMovieClick?: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onMovieClick }) => {
    const getFormatColor = (format: string) => {
        switch (format) {
            case 'VHS': return 'hsl(280, 50%, 50%)';
            case 'DVD': return 'hsl(220, 90%, 55%)';
            case 'Blu-ray': return 'hsl(120, 50%, 45%)';
            default: return 'hsl(220, 10%, 60%)';
        }
    };

    const handleClick = () => {
        if (onMovieClick) {
            onMovieClick(movie.id);
        }
    };

    return (
        <div
            className={styles.card}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-label={`View details for ${movie.title}`}
        >
            <div className={styles.header}>
                <h3 className={styles.title}>{movie.title}</h3>
                <span
                    className={styles.format}
                    style={{ backgroundColor: getFormatColor(movie.format) }}
                >
                    {movie.format}
                </span>
            </div>

            <div className={styles.detailLabel}>Year: </div>
            <div className={styles.year}>
                {movie.year}
            </div>

            <div className={styles.viewHint}>
                Click to view details
            </div>
        </div>
    );
};

export default MovieCard;