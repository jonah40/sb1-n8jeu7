import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}