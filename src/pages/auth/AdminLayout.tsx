// src/admin/layouts/AdminLayout.tsx
import { useState } from "react";
import Sidebar from "@/admin/components/Sidebar";
import AdminHeader from "@/admin/components/AdminHeader";
import Breadcrumbs from "@/admin/components/Breadcrumbs";
import { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminRouteGuard from "./AdminRouteGuard";

interface BreadcrumbItem {
  label: string;
  to: string;
  isCurrent: boolean;
}

interface AdminLayoutProps {
  children?: ReactNode;
}

// Helper function to generate breadcrumbs
const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(segment => segment);
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", to: "/admin", isCurrent: pathname === "/admin" || pathname === "/admin/" }
  ];

  let currentPath = "/admin";
  pathSegments.forEach((segment, index) => {
    if (segment.toLowerCase() === 'admin' && index === 0 && pathSegments.length > 1) {
      // Skip the 'admin' segment if it's the first part of a longer path like /admin/products
      // The "Home" breadcrumb already covers /admin
      return;
    } 
    // if it is the first segment and it is not admin, it means it is a subpage of admin like /admin/products, so we need to add the admin segment
    if (index === 0 && segment.toLowerCase() !== 'admin') {
        currentPath = `${currentPath}/${segment}`;
    } else if (index > 0) {
        currentPath = `${currentPath}/${segment}`;
    }
    
    // Capitalize the first letter of the segment for the label
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const isCurrentPage = index === pathSegments.length - 1 || (index === 0 && pathSegments.length === 1 && segment.toLowerCase() !== 'admin');

    // Avoid adding duplicate "Home" or if the segment is just "admin" and Home already exists
    if (label === "Admin" && breadcrumbItems.find(item => item.label === "Home")) {
        if (pathSegments.length === 1) { // If only "admin" segment, update "Home" to be current
            breadcrumbItems[0].isCurrent = true;
            return;
        }
        // If it's like /admin/products, don't add an "Admin" breadcrumb if Home (/admin) exists
        return; 
    }

    breadcrumbItems.push({
      label: label,
      to: currentPath,
      isCurrent: isCurrentPage,
    });
  });
  
  // Ensure that if the path is just /admin, only "Home" is marked current and no duplicate "Admin" entry
  if (pathname === "/admin" || pathname === "/admin/") {
    return [{ label: "Home", to: "/admin", isCurrent: true }];
  }

  // If the last generated item is the same as Home but path is longer, set Home to not current
  if (breadcrumbItems.length > 1 && breadcrumbItems[0].label === "Home" && breadcrumbItems[0].to === "/admin") {
    breadcrumbItems[0].isCurrent = false;
  }

  return breadcrumbItems;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [activePath, setActivePath] = useState<string>("/dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const location = useLocation();

  const handleNavClick = (path: string) => {
    setActivePath(path);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const breadcrumbItems = generateBreadcrumbs(location.pathname);

  return (
    <AdminRouteGuard>
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          activePath={activePath}
          handleNavClick={handleNavClick}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          ></div>
        )}

        {/* Main content area */}
        <div className={`flex-1 overflow-x-hidden md:transition-all md:duration-300 ${isCollapsed ? 'md:ml-[70px]' : 'md:ml-64'}`}>
          {/* Admin Header */}
          <AdminHeader 
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
          
          {/* Page Content */}
          <div className="p-4 md:p-6 lg:p-8">
            <Breadcrumbs items={breadcrumbItems} />
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default AdminLayout;