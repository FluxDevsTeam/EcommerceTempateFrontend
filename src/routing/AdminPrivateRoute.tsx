// AdminPrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type AdminPrivateRouteProps = {
  isAuthenticated: boolean;
};

const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({ isAuthenticated }) => {
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default AdminPrivateRoute;
