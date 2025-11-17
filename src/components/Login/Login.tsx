import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { login } from '../../store/actions/authActions';
import { checkAuth } from '../../store/actions/authActions';
import styles from "./Login.module.css"

export const Login: React.FC = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

    useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(()=> {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Вход в систему</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            className={styles.input}
          />
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !formData.email || !formData.password}
          className={styles.submitButton}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      <button 
        onClick={() => { navigate("/register") }}
        className={styles.registerButton}
      >
        Зарегистрироваться
      </button>
    </div>
  );
};