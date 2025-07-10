import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>No movies found</div>
            <div className={styles.description}>
                Your movie collection is empty. Start adding movies to build your library!
            </div>
        </div>
    );
};

export default EmptyState;