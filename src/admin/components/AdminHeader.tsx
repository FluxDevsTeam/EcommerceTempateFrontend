import { FiSearch } from "react-icons/fi";
import { BellIcon, Menu, X } from "lucide-react";

interface AdminHeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const AdminHeader = ({ isMobileMenuOpen, toggleMobileMenu }: AdminHeaderProps) => {
  return (
    <div className="md:flex-row flex flex-col space-y-4 md:space-y-0 justify-between items-center p-8">
      <div className="flex space-x-5">
        <button onClick={toggleMobileMenu} className="text-black md:hidden">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <p className="md:text-3xl text-2xl font-medium text-black">Welcome Back Admin</p>
      </div>
      
      <div className='flex space-x-4'>
        <div className="md:w-[435px] w-full h-[45px] border rounded-lg bg-white border-black flex justify-between items-center px-4 gap-3">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for items"
            className="w-full h-full outline-none bg-transparent placeholder-gray-500"
          />
        </div>
        <BellIcon size={35}/>
      </div>
    </div>
  );
};

export default AdminHeader;