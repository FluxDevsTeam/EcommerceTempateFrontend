import { Menu,X } from "lucide-react";

interface AdminHeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const AdminHeader = ({ isMobileMenuOpen, toggleMobileMenu }: AdminHeaderProps) => {
  return (
    <div className="md:flex-row flex flex-col space-y-4 md:space-y-0 justify-between items-center p-8">
      <div className=" w-full flex justify-between items-center mb-6">
        <button onClick={toggleMobileMenu} className="text-black md:hidden">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
       
               <h1 className="md:text-2xl text-lg font-bold">Welcome Back, Marci</h1>
               <div className="flex gap-4">
                 <button className="p-2 rounded-full bg-white shadow">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <circle cx="11" cy="11" r="8"></circle>
                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                   </svg>
                 </button>
                 <button className="p-2 rounded-full bg-white shadow">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                     <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                   </svg>
                 </button>
               </div>
             </div>
      </div>
      
 
 
  );
};

export default AdminHeader;