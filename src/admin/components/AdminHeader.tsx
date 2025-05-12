import { Menu,X } from "lucide-react";

interface AdminHeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const AdminHeader = ({ isMobileMenuOpen, toggleMobileMenu }: AdminHeaderProps) => {
  return (
    <div className="md:flex-row flex flex-col space-y-4 md:space-y-0 justify-between items-center p-8 md:p-0">
      <div className=" w-full flex justify-between items-center mb-2 ">
        <button onClick={toggleMobileMenu} className="text-black md:hidden">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
      
             </div>
      </div>
      
 
 
  );
};

export default AdminHeader;