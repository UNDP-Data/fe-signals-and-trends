import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Context from '../Context/Context';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin } = useContext(Context);

  if (!isAdmin) {
    // Redirect non-admin users to the home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};