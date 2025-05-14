import { Link, useLocation, matchPath } from 'react-router-dom';
import { routes } from '@/routing/route';
import { useEffect, useState } from 'react';


interface Category {
  id: number;
  name: string;
}


const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const [categories, setCategories] = useState([]);

  // Fetch categories (similar to your existing fetch)
  useEffect(() => {
    const cachedCategories = localStorage.getItem('cachedCategories');
    if (cachedCategories) {
      setCategories(JSON.parse(cachedCategories));
    }
  }, []);

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') return null;

  // Function to get category name by ID
  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.id.toString() === id.toString());
    return category ? category.name : 'Category';
  };

  // Function to get dynamic name based on route and params
  const getRouteName = (route, path) => {
    const match = matchPath({ path: route.path }, path);
    
    if (route.path === '/category/:id' && match?.params.id) {
      return getCategoryName(match.params.id);
    }
    
    // Add other dynamic routes here as needed
    // if (route.path === '/product/item/:id') {...}
    
    return route.name;
  };

  return (
    <nav className="flex items-center text-sm text-gray-600 py-4 px-6 md:px-24 mt-8">
      <Link to="/" className="text-blue-600 hover:underline">Home</Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const route = routes.find(route => matchPath({ path: route.path }, to));
        
        if (!route) return null;
        
        const displayName = getRouteName(route, to);
        
        return (
          <span key={to} className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            {isLast ? (
              <span className="text-gray-800">{displayName}</span>
            ) : (
              <Link 
                to={to} 
                className="text-blue-600 hover:underline"
              >
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;