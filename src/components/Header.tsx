import { useEffect, useRef, useState } from "react";
import { BsCart } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoPersonCircleOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi"; // Import logout icon
import FiltersComponent from "@/pages/filters/Filter";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiEqualizerLine } from "react-icons/ri";
import SearchInput from "./SearchInput";
import { useAuth } from "@/pages/auth/AuthContext";

// Define the FilterState type
interface FilterState {
  selectedSubCategories: number[];
  priceRange: [number, number];
  selectedSizes: string[];
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState<boolean>(false);
    
  const { currentUser, isAuthenticated, refreshUserData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const toggleAccountDropdown = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      // Close any open menus
      setShowAccountDropdown(false);
      setIsOpen(false);
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
    <>
      <div 
        ref={navbarRef}
        className={`fixed top-0 left-0 w-full bg-white z-50 md:px-24 py-4
          ${scrolled ? 'shadow-md' : ''}
          transition-all duration-300 ease-in-out
          ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="flex justify-between items-center">
            <Link to='/'><p className="font-bold text-3xl">SHOP.CO</p></Link>  
            <div className="flex space-x-4 items-center">
              <BsCart size={30} className="cursor-pointer hover:text-gray-600"/>
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={toggleAccountDropdown}
                  className="flex items-center gap-2 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {isUserAuthenticated && displayName ? (
                    <div className="flex items-center">
                      <span className="text-sm font-medium bg-blue-200 px-3 py-1 rounded-r-md">
                      Welcome back, {displayName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium">Sign In</span>
                  )}
                  <IoPersonCircleOutline size={35}/>
                </div>
                
                {/* Account dropdown menu */}
                {showAccountDropdown && isUserAuthenticated && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      My Account
                    </Link>
                    <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          Orders
                        </Link>
                        <Link 
                          to="/cart" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                         Cart
                        </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
                
                {/* If not authenticated, clicking shows login/sign up options */}
                {showAccountDropdown && !isUserAuthenticated && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                onClick={toggleMenu}
              >
                {!isOpen ? <AiOutlineMenu size={30} /> : <AiOutlineClose size={30}/>}
              </button>
              <Link to='/'><p className="font-bold text-3xl">SHOP.CO</p></Link>
            </div>
            <div className="flex space-x-4 items-center">
              <BsCart size={30} className="cursor-pointer hover:text-gray-600"/>
              <div onClick={toggleAccountDropdown} className="relative">
                <div className="flex items-center gap-2 hover:text-gray-600 transition-colors cursor-pointer">
                  {isUserAuthenticated && displayName ? (
                    <span className="text-xs font-medium bg-blue-100 px-2 py-1 rounded truncate max-w-20">
                      Hi, {displayName}
                    </span>
                  ) : null}
                  <IoPersonCircleOutline size={35}/>
                </div>
                
                {/* Mobile dropdown */}
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {isUserAuthenticated ? (
                      <>
                        <Link 
                          to="/account" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          My Account
                        </Link>
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          Orders
                        </Link>
                        <Link 
                          to="/cart" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                         Cart
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiLogOut className="mr-2" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="block md:hidden p-7">
            <div className="flex flex-col w-full space-y-4">
              {isUserAuthenticated && displayName && (
                <div className="bg-blue-50 rounded-md p-3 mb-2">
                  <p className="text-sm text-blue-700">Welcome back, {displayName}!</p>
                  <div className="flex mt-2">
                    <Link 
                      to="/account" 
                      className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-sm text-red-600 hover:text-red-800"
                    >
                      <FiLogOut className="mr-1" /> Logout
                    </button>
                  </div>
                </div>
              )}
              <ul className="flex flex-col space-y-5 text-[16px] font-medium leading-[100%]">
                <Link to='/categories' className="hover:text-gray-600 transition-colors"><li>New Arrivals</li></Link>  
                <Link to='/shoe-category' className="hover:text-gray-600 transition-colors"><li>Shoes</li></Link>
                <Link to='/accessories-category' className="hover:text-gray-600 transition-colors"><li>Accessories</li></Link>
                <Link to='/clothes-category' className="hover:text-gray-600 transition-colors"><li>Clothes</li></Link>
              </ul>
              <SearchInput onItemSelect={handleSearchItemSelect}/>
              <div className="flex space-x-3">
                <button 
                  onClick={toggleFilter}
                  className="cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <RiEqualizerLine size={30}/>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add spacer to prevent content from hiding behind fixed header */}
      <div className="h-24 md:h-28"></div>

      {/* Filter Component - Pass the correct props */}
      <FiltersComponent 
        isOpen={showFilter} 
        onClose={toggleFilter}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default Header;