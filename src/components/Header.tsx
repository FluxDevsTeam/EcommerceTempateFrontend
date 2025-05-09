import { useEffect, useRef, useState } from "react";
import { BsCart } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoPersonCircleOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import FiltersComponent from "@/pages/filters/Filter";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiEqualizerLine } from "react-icons/ri";
import SearchInput from "./SearchInput";
import { useAuth } from "@/pages/auth/AuthContext";
import { FaUserCheck } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

// Define the FilterState type
interface FilterState {
  selectedSubCategories: number[];
  priceRange: [number, number];
  selectedSizes: string[];
}

const Header = () => {
  // Separate state variables for different dropdowns
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  
  const { currentUser, isAuthenticated, refreshUserData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Force refresh of user data when the component mounts or location changes
  useEffect(() => {
    const checkAndRefreshUserData = async () => {
      console.log("Location changed, checking auth state:", { isAuthenticated, currentUser });
      // Only call refreshUserData if we have tokens but no user data
      if (localStorage.getItem('accessToken') && (!currentUser || !currentUser.first_name)) {
        try {
          await refreshUserData();
        } catch (err) {
          console.error("Failed to refresh user data on location change:", err);
        }
      }
    };
    
    checkAndRefreshUserData();
  }, [location, refreshUserData, isAuthenticated, currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { 
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMobileMenuLinkClick = () => {
    setIsMobileMenuOpen(false); // Close only the mobile menu
  };

  // Create display name function to ensure consistency
  const getDisplayName = (): string | null => {
    // First check if we have currentUser from context
    if (currentUser?.first_name) {
      return currentUser.first_name;
    }
    
    // Fallback to localStorage if context isn't updated yet
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const storedUser = JSON.parse(userJson);
        if (storedUser?.first_name) {
          return storedUser.first_name;
        }
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
    }
    
    return null;
  };

  const handleSearchItemSelect = (): void => {
    setIsMobileMenuOpen(false); // Close only the mobile menu
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other dropdowns when mobile menu is toggled
    if (!isMobileMenuOpen) {
      setIsUserDropdownOpen(false);
      setShowFilter(false);
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    // Close mobile menu if user dropdown is being opened on mobile
    if (!isUserDropdownOpen && window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    // Close other dropdowns when filter is toggled
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      // Close any open menu
      setIsUserDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  // Handle applying filters from the header
  const handleApplyFilters = (filters: FilterState) => {
    // Build query parameters for URL matching the API parameters
    const searchParams = new URLSearchParams();
    
    // Add subcategories to query
    if (filters.selectedSubCategories.length > 0) {
      // Store the selected subcategories for the filtering page to use
      searchParams.append('subcategories', filters.selectedSubCategories.join(','));
      
      // Add each subcategory individually for potential direct use with API
      filters.selectedSubCategories.forEach(subCatId => {
        searchParams.append('sub_category', subCatId.toString());
      });
    }
    
    // Add price range to query
    if (filters.priceRange && filters.priceRange.length === 2) {
      // Store the price range for the filtering page
      searchParams.append('minPrice', filters.priceRange[0].toString());
      searchParams.append('maxPrice', filters.priceRange[1].toString());
      
      // Add API parameters
      searchParams.append('min_price', filters.priceRange[0].toString());
      searchParams.append('max_price', filters.priceRange[1].toString());
    }
    
    // Add sizes to query (for client-side filtering since API doesn't support size filtering)
    if (filters.selectedSizes.length > 0) {
      searchParams.append('sizes', filters.selectedSizes.join(','));
    }
    
    // Navigate to filtered products page
    navigate(`/filtered-products?${searchParams.toString()}`);
    
    // Close the filter panel
    setShowFilter(false);
  };

  // Force check authentication by checking localStorage directly
  const checkIsAuthenticated = () => {
    return !!localStorage.getItem('accessToken') && !!localStorage.getItem('user');
  };

  // Use forced checks for more reliable display
  const isUserAuthenticated = isAuthenticated || checkIsAuthenticated();
  const displayName = getDisplayName();

  return (
    <div 
      ref={navbarRef}
      className={`w-full bg-white fixed top-0 left-0  z-50 md:px-24 py-4
        ${scrolled ? 'shadow-md' : ''}
        transition-all duration-300 ease-in-out
        ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
    >
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center">
          <Link to='/'><p className="font-bold text-3xl">SHOP.CO</p></Link>  
          <div className="flex space-x-6 items-center">
       
            
            {/* User account section */}
            <div className="relative">
              {isUserAuthenticated ? (
                <div 
                
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-sm font-medium bg-blue-200 px-3 py-1 rounded-md">
                    Welcome, {displayName}
                  </span>
                <span  onClick={toggleUserDropdown} ><FaUserCheck size={24} /> </span>  
                <span>   <Link 
                   to="/wishlist"
                   className="hover:text-gray-600 transition-colors"
                         >
                  <FaRegHeart size={24} />
                 </Link>
                 </span>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sign In</span>
                  <IoPersonCircleOutline size={28} />
                </Link>
              )}
              
              {/* User dropdown menu */}
              {isUserAuthenticated && isUserDropdownOpen && (
                <div 
                  className="absolute right-0 top-10 z-10 w-auto rounded-lg border border-gray-300 bg-white shadow-md"
                  role="menu"
                >
                  <Link 
                    to="/orders" 
                    className="block w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    role="menuitem"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link 
                    to="/general-settings" 
                    className="block w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    role="menuitem"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left"
                    role="menuitem"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
            <Link to="/cart" className="hover:text-gray-600 transition-colors">
              <BsCart size={26} />
            </Link>
          </div>
        </div>
        
        {/* Desktop navigation links and search */}
        <div className="flex justify-between items-center mt-4">
          <ul className="flex space-x-6 text-[16px] font-medium font-poppins">
            <Link to='/categories' className="hover:text-gray-600 transition-colors"><li>New Arrivals</li></Link>  
            <Link to='/shoe-category' className="hover:text-gray-600 transition-colors"><li>Shoes</li></Link>
            <Link to='/accessories-category' className="hover:text-gray-600 transition-colors"><li>Accessories</li></Link>
            <Link to='/clothes-category' className="hover:text-gray-600 transition-colors"><li>Clothes</li></Link>
          </ul>
          <SearchInput onItemSelect={handleSearchItemSelect}/>
          <button 
            onClick={toggleFilter}
            className="cursor-pointer hover:text-gray-600 transition-colors"
            aria-label="Open filters"
          >
            <RiEqualizerLine size={30}/>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="block md:hidden">
        <div className="flex justify-between items-center px-4">
          <div className="flex space-x-3 items-center">
            <button 
              className="focus:outline-none hover:text-gray-600 transition-colors"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
            </button>
            <Link to='/'><p className="font-bold text-2xl">SHOP.CO</p></Link>
          </div>
          
          {/* Mobile icons - consistently displayed regardless of auth state */}
          <div className="flex items-center space-x-4">
            {isUserAuthenticated ? (
              <div className="flex space-x-3">
              <button 
                onClick={toggleUserDropdown}
                className="hover:text-gray-600 transition-colors" 
                aria-label="User account"
              >
                <FaUserCheck size={24} />
              </button>
                   <Link 
                   to="/wishlist"
                   className="hover:text-gray-600 transition-colors"
                         >
                  <FaRegHeart size={24} />
                 </Link></div>
            ) : (
              <Link to="/login" className="hover:text-gray-600 transition-colors" aria-label="Sign in">
                <IoPersonCircleOutline size={28} />
              </Link>
            )}
       
            <Link to="/cart" className="hover:text-gray-600 transition-colors" aria-label="Cart">
              <BsCart size={24} />
            </Link>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isUserAuthenticated && isUserDropdownOpen && (
          <div className="absolute right-6 top-12 z-50 w-auto rounded-md border border-gray-300 bg-white shadow-lg">
             <Link 
              to="/general-settings"
              onClick={() => setIsUserDropdownOpen(false)}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              Account Settings
            </Link>
            <Link 
              to="/orders"
              onClick={() => setIsUserDropdownOpen(false)}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              Orders
            </Link>
          
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        )}
        <div className=" p-4">
        <SearchInput onItemSelect={handleSearchItemSelect}/>
        </div>

        {/* Mobile Menu - expanded navigation */}
        {isMobileMenuOpen && (
          <div className="block bg-white md:hidden p-4 border-t mt-2">
            <div className="flex flex-col w-full space-y-4">
              {isUserAuthenticated && displayName && (
                <div className="bg-blue-50 rounded-md p-2 mb-2">
                  <p className="text-sm text-blue-700">Welcome back, {displayName}!</p>
                </div>
              )}
              <ul className="flex flex-col space-y-4 text-[16px] font-medium">
                <Link to='/categories' onClick={handleMobileMenuLinkClick} className="hover:text-gray-600 transition-colors">
                  <li>New Arrivals</li>
                </Link>  
                <Link to='/shoe-category' onClick={handleMobileMenuLinkClick} className="hover:text-gray-600 transition-colors">
                  <li>Shoes</li>
                </Link>
                <Link to='/accessories-category' onClick={handleMobileMenuLinkClick} className="hover:text-gray-600 transition-colors">
                  <li>Accessories</li>
                </Link>
                <Link to='/clothes-category' onClick={handleMobileMenuLinkClick} className="hover:text-gray-600 transition-colors">
                  <li>Clothes</li>
                </Link>
              </ul>
              
              <button 
                onClick={toggleFilter}
                className="flex items-center space-x-2 cursor-pointer hover:text-gray-600 transition-colors"
              >
                <RiEqualizerLine size={24}/>
                <span>Filter Products</span>
              </button>
            </div>
          </div>
        )}
      </div>

     

      {/* Filter Component */}
      <FiltersComponent 
        isOpen={showFilter} 
        onClose={toggleFilter}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default Header;