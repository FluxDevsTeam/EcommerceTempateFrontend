// Breadcrumbs.jsx
import { Link, useLocation, matchPath } from 'react-router-dom';
import { routes } from '@/routing/route';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') return null;
  
  return (
    <nav className="flex items-center text-sm text-gray-600 py-4 px-6  md:px-24 ">
      <Link to="/" className="text-blue-600 hover:underline">Home</Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const route = routes.find(route => matchPath({ path: route.path }, to));
        
        if (!route) return null;
        
        return (
          <span key={to} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            {isLast ? (
              <span className="text-gray-800">{route.name}</span>
            ) : (
              <Link 
                to={to} 
                className="text-blue-600 hover:underline"
              >
                {route.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;