import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthContainer from '@/components/auth/authContainer/AuthContainer';
import Header from '@/components/layout/header/Header';
import styles from './App.module.css';

function App() {
  const { isAuthenticated, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className={styles.app}>
      {isAuthenticated && <Header />}

      <ProtectedRoute fallback={<AuthContainer />}>
        <main className={styles.main}>
        </main>
      </ProtectedRoute>
    </div>
  );
}

export default App;