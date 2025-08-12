import{ ReactNode } from "react";
import { Outlet } from "react-router-dom";




interface AuthLayoutProps {
  children?: ReactNode; // Children is now optional
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div 
    className=" min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ 
        backgroundImage: 'url(/images/image2.png)',
      }}
    >
        <div className="bg-white p-8  my-4  max-w-md w-full">
      {children || <Outlet />} {/* Supports both direct children + <Outlet> */}
      </div>
    </div>
  );
}

export default AuthLayout;