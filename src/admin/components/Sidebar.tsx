import {
  Home,
  Package,
  ShoppingCart,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
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
  toggleCollapse,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      
    }
  };

  const handleHelpCentreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNavClick("/help");
    window.open("https://fluxdevs.com/Contact", "_blank");
  };

  return (
    <div
      className={`
       bg-[#222222] text-white border-r border-gray-600 
       fixed top-0 left-0 h-screen z-50 flex-col transition-all duration-300
       ${
         isMobileMenuOpen
           ? "flex w-64" // Mobile flyout menu
           : isCollapsed
           ? "hidden md:flex w-[70px]" // Desktop collapsed
           : "hidden md:flex w-64" // Desktop expanded
       }
    `}
    >
      {/* Top section: Logo and Toggle/Close Button */}
      <div
        className={`flex transition-all duration-300
          ${isMobileMenuOpen
            ? 'items-center p-4 justify-between' // Mobile view: logo and X button side-by-side
            : !isCollapsed 
            ? 'flex-col items-start p-4 space-y-4' // Desktop Expanded: logo above toggle, items start-aligned
            : 'flex-col items-center p-3 space-y-3' // Desktop Collapsed: logo icon above toggle icon, centered
          }
        `}
      >
        {isMobileMenuOpen ? (
          // Mobile Flyout Menu Top
          <>
            <Link to="/admin" onClick={() => handleNavClick("/admin")} className="focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-sm">
              <img src={"/images/logo.png"} alt={"SHOP.CO Logo"} className="h-9 w-auto" />
            </Link>
            <button 
              onClick={toggleMobileMenu} 
              className="text-white p-1.5 rounded-md hover:bg-gray-700/60 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#222222] focus:ring-gray-400"
              title="Close menu"
            >
              <X size={22} />
            </button>
          </>
        ) : !isCollapsed ? (
          // Desktop Expanded View (w-64)
          <>
            <Link to="/admin" onClick={() => handleNavClick("/admin")} className="focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-sm">
              <img src={"/images/logo.png"} alt={"SHOP.CO Logo"} className="h-10 w-auto" />
            </Link>
            <button
              onClick={toggleCollapse}
              title="Collapse sidebar"
              className="p-1.5 rounded-md hover:bg-gray-600/75 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#222222] focus:ring-gray-400"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        ) : (
          // Desktop Collapsed View (w-[70px])
          <>
            <Link to="/admin" onClick={() => handleNavClick("/admin")} className="block focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-sm">
              <img
                src={"/images/logo.png"} 
                alt="Logo"
                className="h-8 w-8 object-contain" // Small logo icon - increased size
              />
            </Link>
            <button
              onClick={toggleCollapse}
              title="Expand sidebar"
              className="p-1 rounded-md hover:bg-gray-600/75 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-[#222222] focus:ring-gray-400"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Main container with flex to create space between main nav and bottom nav */}
      <div className="flex flex-col flex-1 px-3 py-2 h-full overflow-y-auto">
        {/* Main navigation items */}
        <div className="space-y-2.5"> {/* Adjusted spacing slightly */}
          <NavItem
            icon={<Home className="h-5 w-5" />}
            label="Dashboard"
            to="/admin"
            active={activePath === "/admin"}
            onClick={() => handleNavClick("/admin")}
            isCollapsed={isCollapsed && !isMobileMenuOpen}
          />
          <NavItem
            icon={<Package className="h-5 w-5" />}
            label="Product"
            to="/admin/products"
            active={activePath === "/admin/products"}
            onClick={() => handleNavClick("/admin/products")}
            isCollapsed={isCollapsed && !isMobileMenuOpen}
          />
          <NavItem
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Orders"
            to="/admin/orders"
            active={activePath === "/admin/orders"}
            onClick={() => handleNavClick("/admin/orders")}
            isCollapsed={isCollapsed && !isMobileMenuOpen}
          />
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            label="Setting"
            to="/admin/settings"
            active={activePath === "/admin/settings"}
            onClick={() => handleNavClick("/admin/settings")}
            isCollapsed={isCollapsed && !isMobileMenuOpen}
          />
        </div>

        {/* Bottom navigation items - pushed to bottom with margin-top auto */}
        <div className="mt-auto space-y-2 mb-5"> {/* Adjusted spacing & margin */}
          <NavItem
            icon={<Store className="h-5 w-5" />}
            label="Visit Store"
            to="/"
            active={activePath === "/"}
            onClick={() => {
              handleNavClick("/");
              navigate("/", { replace: false });
            }}
            isCollapsed={isCollapsed && !isMobileMenuOpen}
          />
          <NavItem
            icon={<HelpCircle className="h-5 w-5" />}
            label="Help Centre"
            to="https://fluxdevs.com/Contact"
            active={activePath === "/help"}
            onClick={handleHelpCentreClick}
            isCollapsed={isCollapsed && !isMobileMenuOpen}
          />
          <NavItem
            icon={<LogOut className="h-5 w-5 text-red-500" />} // Icon remains red
            label="Log out"
            to="/login"
            active={activePath === "/logout"}
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10" // Label red, specific hover
            isCollapsed={isCollapsed && !isMobileMenuOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
