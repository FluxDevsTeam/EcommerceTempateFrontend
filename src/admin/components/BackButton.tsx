import { IoChevronBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

interface BackButtonProps {
  label?: string;
}

const BackButton = ({ label = "back" }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide back button on main admin pages
  const mainAdminPages = [
    '/admin',
    '/admin/products',
    '/admin/orders',
    '/admin/settings'
  ];
  
  if (mainAdminPages.includes(location.pathname)) {
    return null;
  }

  const handleBack = () => {
    const path = location.pathname;
    
    // Handle nested product routes
    if (path.includes('/admin/products/') || path.includes('/admin/admin-products-details/')) {
      navigate('/admin/products');
      return;
    }
    
    // Handle nested category routes
    if (path.includes('/admin/admin-categories/')) {
      navigate('/admin/admin-categories');
      return;
    }

    // Handle add new product route
    if (path === '/admin/add-new-product') {
      navigate('/admin/products');
      return;
    }

    // Default fallback
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
      aria-label="Go back"
    >
      <IoChevronBack className="w-5 h-5 mr-1" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default BackButton;