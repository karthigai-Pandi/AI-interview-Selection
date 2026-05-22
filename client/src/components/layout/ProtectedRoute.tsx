import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: 'admin' | 'hr' | 'candidate';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  if (!token || !user) {
    return <Navigate replace to="/login" />;
  }
  if (role && user.role !== role) {
    return <Navigate replace to="/" />;
  }
  return children;
};

export default ProtectedRoute;
