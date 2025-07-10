import React from 'react';
import { Movie } from '@/types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const getFormatColor = (format: string) => {
        switch (format) {
            case 'VHS': return 'hsl(280, 50%, 50%)';
            case 'DVD': return 'hsl(220, 90%, 55%)';
            case 'Blu-ray': return 'hsl(120, 50%, 45%)';
            default: return 'hsl(220, 10%, 60%)';
        }
    };

    return (
        <div className={styles.card}>
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

            <div className={styles.actors}>
                <div className={styles.detailLabel}>Actors:</div>
                <div className={styles.actorsList}>
                    {movie.actors.length > 0 ? (
                        movie.actors.join(', ')
                    ) : (
                        <span className={styles.noActors}>No actors listed</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;