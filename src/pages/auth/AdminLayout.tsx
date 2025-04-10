import { useState } from "react";
import Sidebar from "@/admin/components/Sidebar";
import AdminHeader from "@/admin/components/AdminHeader";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children?: ReactNode; // Children is now optional
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
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        activePath={activePath}
        handleNavClick={handleNavClick}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Main content area */}
      <div className="flex-1">
        {/* Admin Header */}
        <AdminHeader 
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        
        {/* Page Content */}
        <div className="p-8">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;