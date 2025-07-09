import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/button/Button';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const { logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    Movie Management App
                </div>
                <div className={styles.userSection}>
                    <span className={styles.welcome}>
                        Welcome!
                    </span>
                    <Button variant="danger" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;