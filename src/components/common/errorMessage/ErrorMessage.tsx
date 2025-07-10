import React from 'react';
import Button from '@/components/common/button/Button';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    showRetry?: boolean;
    className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = 'Something went wrong',
    message,
    onRetry,
    showRetry = true,
    className,
}) => {
    return (
        <div className={`${styles.container} ${className || ''}`}>
            <div className={styles.content}>
                <div className={styles.icon}>
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <line
                            x1="15"
                            y1="9"
                            x2="9"
                            y2="15"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <line
                            x1="9"
                            y1="9"
                            x2="15"
                            y2="15"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>

                {showRetry && onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="primary"
                        size="md"
                        className={styles.retryButton}
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;