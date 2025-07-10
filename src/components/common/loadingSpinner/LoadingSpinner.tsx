import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...',
    size = 'md',
    className,
}) => {
    return (
        <div className={`${styles.container} ${className || ''}`}>
            <div className={`${styles.spinner} ${styles[size]}`}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
            </div>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default LoadingSpinner;