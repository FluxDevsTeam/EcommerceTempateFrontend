import { Home, Package, ShoppingCart, Settings, HelpCircle, LogOut, X } from "lucide-react";
import NavItem from "./NavItem";

interface SidebarProps {
  activePath: string;
  handleNavClick: (path: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Sidebar = ({ 
  activePath, 
  handleNavClick, 
  isMobileMenuOpen, 
  toggleMobileMenu 
}: SidebarProps) => {
  return (
    <div className={`
       bg-[#222222]
  fixed top-0 left-0 h-screen w-64 z-50 flex-col 
  ${isMobileMenuOpen ? 'flex' : 'hidden'}
  md:flex md:z-0
    `}>
      {/* Top section with logo and close button for mobile */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-white">SHOP.CO</h1>
        {isMobileMenuOpen && (
          <button onClick={toggleMobileMenu} className="md:hidden text-white">
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
          />
          <NavItem
            icon={<Package className={`h-5 w-5 ${activePath === "/admin/products" ? "text-black" : ""}`} />}
            label="Product"
            to="/admin/products"
            active={activePath === "/admin/products"}
            onClick={() => handleNavClick("/admin/products")}
          />
          <NavItem
            icon={<ShoppingCart className={`h-5 w-5 ${activePath === "/admin/orders" ? "text-black" : ""}`} />}
            label="Orders"
            to="/admin/orders"
            active={activePath === "/admin/orders"}
            onClick={() => handleNavClick("/admin/orders")}
          />
          <NavItem
            icon={<Settings className={`h-5 w-5 ${activePath === "/admin/settings" ? "text-black" : ""}`} />}
            label="Setting"
            to="/admin/settings"
            active={activePath === "/admin/settings"}
            onClick={() => handleNavClick("/admin/settings")}
          />
        </div>

        {/* Bottom navigation items - pushed to bottom with margin-top auto */}
        <div className="mt-auto space-y-1 mb-6">
          <NavItem 
            icon={<HelpCircle className={`h-5 w-5 ${activePath === "/help" ? "text-black" : ""}`} />} 
            label="Help Centre" 
            to="/help"
            active={activePath === "/help"}
            onClick={() => handleNavClick("/help")}
          />
          <NavItem
            icon={<LogOut className={`h-5 w-5 text-red-500 ${activePath === "/logout" ? "text-black" : ""}`} />}
            label="Log out"
            to="/logout"
            active={activePath === "/logout"}
            onClick={() => handleNavClick("/logout")}
            className={`${activePath === "/logout" ? "text-black" : "text-red-500"} hover:text-black`}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;