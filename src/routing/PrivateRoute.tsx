import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type PrivateRouteProps = {
    isAuthenticated: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
    const location = useLocation();
    
    if (!isAuthenticated) {
        // Store the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;