import { Home, Package, ShoppingCart, Settings, HelpCircle, LogOut, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import { useAuth } from "../../pages/auth/AuthContext";

interface SidebarProps {
  activePath: string;
  handleNavClick: (path: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ 
  activePath, 
  handleNavClick, 
  isMobileMenuOpen, 
  toggleMobileMenu, 
  isCollapsed,
  toggleCollapse
}: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleHelpCentreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNavClick("/help");
    window.open("https://fluxdevs.com/Contact", "_blank");
  };

  return (
    <div className={`
       bg-[#222222] text-white
       fixed top-0 left-0 h-screen z-50 flex-col transition-all duration-300
       ${isMobileMenuOpen ? 'flex w-64' : isCollapsed ? 'hidden md:flex w-20' : 'hidden md:flex w-64'}
    `}>
      {/* Top section with logo and toggle/close button */}
      <div className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {/* Logo - only shown when sidebar is expanded */} 
        {!isCollapsed && (
          <Link to="/admin" className="transition-all duration-300">
              <img 
                src={"/images/logo.png"} 
                alt={"SHOP.CO Logo"} 
                className={'h-10 w-auto cursor-pointer'}
              />
            </Link>
        )}
        
        {/* Desktop Collapse/Expand Toggle Button */} 
        {!isMobileMenuOpen && (
          <button 
            onClick={toggleCollapse} 
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              hidden md:block p-2 rounded-md hover:bg-gray-700/50 transition-all duration-300 
              focus:outline-none focus:ring-2 focus:ring-gray-500
              ${isCollapsed ? 'h-10 w-12 bg-no-repeat bg-center' : ''}
            `}
            style={isCollapsed ? { backgroundImage: `url('/images/logo.png')`, backgroundSize: 'contain' } : {}}
          >
            {!isCollapsed && <ChevronLeft size={20} />}
            {/* When collapsed, the background image serves as the icon */}
          </button>
        )}

        {/* Mobile Menu Close Button - shown only when mobile flyout is open */} 
        {isMobileMenuOpen && (
          <button onClick={toggleMobileMenu} className="md:hidden text-white p-2">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Main container with flex to create space between main nav and bottom nav */}
      <div className="flex flex-col flex-1 px-3 py-2 h-full">
        {/* Main navigation items */}
        <div className="space-y-3">
          <NavItem
            icon={<Home className={`h-5 w-5 ${activePath === "/dashboard" ? "text-black" : ""}`} />}
            label="Dashboard"
            to="/admin"
            active={activePath === "/dashboard"}
            onClick={() => handleNavClick("/dashboard")}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<Package className={`h-5 w-5 ${activePath === "/admin/products" ? "text-black" : ""}`} />}
            label="Product"
            to="/admin/products"
            active={activePath === "/admin/products"}
            onClick={() => handleNavClick("/admin/products")}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<ShoppingCart className={`h-5 w-5 ${activePath === "/admin/orders" ? "text-black" : ""}`} />}
            label="Orders"
            to="/admin/orders"
            active={activePath === "/admin/orders"}
            onClick={() => handleNavClick("/admin/orders")}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<Settings className={`h-5 w-5 ${activePath === "/admin/settings" ? "text-black" : ""}`} />}
            label="Setting"
            to="/admin/settings"
            active={activePath === "/admin/settings"}
            onClick={() => handleNavClick("/admin/settings")}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Bottom navigation items - pushed to bottom with margin-top auto */}
        <div className="mt-auto space-y-1 mb-6">
          <NavItem 
            icon={<HelpCircle className={`h-5 w-5 ${activePath === "/help" ? "text-black" : ""}`} />} 
            label="Help Centre" 
            to="https://fluxdevs.com/Contact"
            active={activePath === "/help"}
            onClick={handleHelpCentreClick}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<LogOut className={`h-5 w-5 text-red-500 ${activePath === "/logout" ? "text-black" : ""}`} />}
            label="Log out"
            to="/login"
            active={activePath === "/logout"}
            onClick={() => handleLogout()}
            className={`${activePath === "/logout" ? "text-black" : "text-red-500"} hover:text-black`}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;