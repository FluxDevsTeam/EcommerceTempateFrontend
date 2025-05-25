// src/components/AdminRouteGuard.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        navigate('/login', { state: { from: location }, replace: true });
        return;
      }

      try {
        await axios.get(
          'http://kidsdesignecommerce.pythonanywhere.com/api/v1/admin/dashboard/',
          {
            headers: {
              'Authorization': `JWT ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        setIsAuthorized(true);
      } catch (err: any) {
        localStorage.removeItem('accessToken');
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    verifyAuth();
  }, [navigate, location]);

  if (isAuthorized === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading Admin Page...
      </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRouteGuard;