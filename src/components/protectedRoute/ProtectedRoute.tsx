import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { checkAuth } from '../../store/actions/authActions';
import { Preloader } from '../../UI/Preloader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <div className="container"><h1>Вы не авторизованны</h1></div>;
  }

  return <>{children}</>;
};