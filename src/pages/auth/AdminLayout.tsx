// src/admin/layouts/AdminLayout.tsx
import { useState } from "react";
import Sidebar from "@/admin/components/Sidebar";
import AdminHeader from "@/admin/components/AdminHeader";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import AdminRouteGuard from "./AdminRouteGuard";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [activePath, setActivePath] = useState<string>("/dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (path: string) => {
    setActivePath(path);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AdminRouteGuard>
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          activePath={activePath}
          handleNavClick={handleNavClick}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Main content area */}
        <div className="flex-1 md:ml-64 overflow-x-hidden">
          {/* Admin Header */}
          <AdminHeader 
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
          
          {/* Page Content */}
          <div className="p-4 md:p-6 lg:p-8">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default AdminLayout;