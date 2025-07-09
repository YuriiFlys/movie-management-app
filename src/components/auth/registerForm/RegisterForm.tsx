import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import styles from './RegisterForm.module.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    await register(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const passwordMismatch = formData.password !== formData.confirmPassword && formData.confirmPassword !== '';

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Register</h2>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            autocomplete="off"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
            autocomplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            error={passwordMismatch ? 'Passwords do not match' : undefined}
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading || passwordMismatch}
            className={styles.submitButton}
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <div className={styles.switchForm}>
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className={styles.switchButton}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;