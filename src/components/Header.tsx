import { useEffect, useRef, useState } from "react";
import { BsCart } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoPersonCircleOutline } from "react-icons/io5";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import FiltersComponent from "@/pages/filters/Filter";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiEqualizerLine } from "react-icons/ri";
import SearchInput from "./SearchInput";
import { useAuth } from "@/pages/auth/AuthContext";
import { FaUserCheck } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";

interface FilterState {
  selectedSubCategories: number[];
  priceRange: [number, number];
  selectedSizes: string[];
}

interface Category {
  id: number;
  name: string;
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Add new state for mobile categories pagination
  const [currentPage, setCurrentPage] = useState(0);
  const categoriesPerPage = 5;
  
  const { currentUser, isAuthenticated, refreshUserData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Reset current page when mobile menu is opened
  useEffect(() => {
    if (isMobileMenuOpen) {
      setCurrentPage(0);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Check localStorage for cached categories
        const cachedCategories = localStorage.getItem('cachedCategories');
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
        }

        const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/category/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCategories(data.results);
        localStorage.setItem('cachedCategories', JSON.stringify(data.results));
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (!localStorage.getItem('cachedCategories')) {
          setTimeout(fetchCategories, 5000);
        }
      }
    };

    const checkAndRefreshUserData = async () => {
      if (localStorage.getItem('accessToken') && (!currentUser || !currentUser.first_name)) {
        try {
          await refreshUserData();
        } catch (err) {
          console.error("Failed to refresh user data:", err);
        }
      }
    };
    
    fetchCategories();
    checkAndRefreshUserData();
  }, [location, refreshUserData, isAuthenticated, currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 20) setScrolled(true);
      else setScrolled(false);

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
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileMenuLinkClick = () => setIsMobileMenuOpen(false);
  const handleSearchItemSelect = () => setIsMobileMenuOpen(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsUserDropdownOpen(false);
      setIsMoreDropdownOpen(false);
      setShowFilter(false);
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsMoreDropdownOpen(false);
    if (!isUserDropdownOpen && window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsMoreDropdownOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsUserDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  const handleApplyFilters = (filters: FilterState) => {
    const searchParams = new URLSearchParams();
    
    if (filters.selectedSubCategories.length > 0) {
      searchParams.append('subcategories', filters.selectedSubCategories.join(','));
      filters.selectedSubCategories.forEach(subCatId => {
        searchParams.append('sub_category', subCatId.toString());
      });
    }
    
    if (filters.priceRange && filters.priceRange.length === 2) {
      searchParams.append('minPrice', filters.priceRange[0].toString());
      searchParams.append('maxPrice', filters.priceRange[1].toString());
      searchParams.append('min_price', filters.priceRange[0].toString());
      searchParams.append('max_price', filters.priceRange[1].toString());
    }
    
    if (filters.selectedSizes.length > 0) {
      searchParams.append('sizes', filters.selectedSizes.join(','));
    }
    
    navigate(`/filtered-products?${searchParams.toString()}`);
    setShowFilter(false);
  };

  const checkIsAuthenticated = () => {
    return !!localStorage.getItem('accessToken') && !!localStorage.getItem('user');
  };

  const getDisplayName = (): string => {
    if (currentUser?.first_name) return currentUser.first_name;
    
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const storedUser = JSON.parse(userJson);
        return storedUser?.first_name || "User";
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
    }
    
    return "User";
  };

  const isUserAuthenticated = isAuthenticated || checkIsAuthenticated();
  const displayName = getDisplayName();

  const renderDesktopCategoryLinks = () => {
    const firstFourCategories = categories.slice(0, 4);
    const remainingCategories = categories.slice(4);
    
    return (
      <>
        <Link to='/new-arrivals' className="hover:text-gray-600 transition-colors">
          <li>New Arrivals</li>
        </Link>
        {firstFourCategories.map((category) => (
          <Link 
            key={category.id}
            to={`/category/${category.id}`}
            className="hover:text-gray-600 transition-colors capitalize"
          >
            <li>{category.name.toLowerCase()}</li>
          </Link>
        ))}
        
        {remainingCategories.length > 0 && (
          <div className="relative">
            <button 
              className="flex items-center hover:text-gray-600 transition-colors"
              onClick={toggleMoreDropdown}
            >
              <span>More</span>
              <FiChevronDown className={`ml-1 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMoreDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-out">
                <div className="py-1">
                  {remainingCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize transition-colors"
                      onClick={() => setIsMoreDropdownOpen(false)}
                    >
                      {category.name.toLowerCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const renderMobileCategoryLinks = () => {
    // Calculate total pages based on categories count
    const totalPages = Math.ceil((categories.length + 1) / categoriesPerPage); // +1 for "New Arrivals"
    
    // Create a combined array of "New Arrivals" + categories
    const allItems = [{ id: 'new-arrivals', name: 'New Arrivals' }, ...categories];
    
    // Calculate start and end index for current page
    const startIndex = currentPage * categoriesPerPage;
    const endIndex = Math.min(startIndex + categoriesPerPage, allItems.length);
    
    // Get current items to display
    const currentItems = allItems.slice(startIndex, endIndex);
    
    return (
      <>
        <div className="flex flex-col space-y-1 w-full">
          {currentItems.map((item) => (
            <Link 
              key={item.id}
              to={item.id === 'new-arrivals' ? '/new-arrivals' : `/category/${item.id}`}
              onClick={handleMobileMenuLinkClick}
              className="hover:bg-gray-50 transition-colors capitalize py-1 px-2 rounded-md"
            >
              <li className="list-none">{item.name.toLowerCase()}</li>
            </Link>
          ))}
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.max(0, prev - 1));
                }}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Previous
              </button>
              
              <span className="text-xs text-gray-500">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
                }}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages - 1
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div 
      ref={navbarRef}
      className={`w-full bg-white fixed top-0 left-0 z-50 md:px-24 pt-4 p-0 md:p-4 
        ${scrolled ? 'shadow-md' : ''}
        transition-all duration-300 ease-in-out
        ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
    >
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center">
          <Link to='/'><p className="font-bold text-3xl">SHOP.CO</p></Link>  
          <div className="flex space-x-6 items-center">
            <div className="relative">
              {isUserAuthenticated ? (
                <div className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm font-medium bg-blue-200 px-3 py-1 rounded-md">
                    Welcome, {displayName}
                  </span>
                  <span onClick={toggleUserDropdown}><FaUserCheck size={24} /></span>  
                  <span>
                    <Link to="/wishlist" className="hover:text-gray-600 transition-colors">
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
              
              {isUserAuthenticated && isUserDropdownOpen && (
                <div className="absolute right-0 top-10 z-10 w-auto rounded-lg border border-gray-300 bg-white shadow-md transition-all duration-200 ease-out">
                  <Link 
                    to="/orders" 
                    className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link 
                    to="/general-settings" 
                    className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left transition-colors"
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
        
        <div className="flex justify-between items-center mt-4">
          <ul className="flex space-x-6 text-[16px] font-medium font-poppins items-center">
            {renderDesktopCategoryLinks()}
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
                <Link to="/wishlist" className="hover:text-gray-600 transition-colors">
                  <FaRegHeart size={24} />
                </Link>
              </div>
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

        {isUserAuthenticated && isUserDropdownOpen && (
          <div onClick={(e) => e.stopPropagation()} className="absolute right-6 top-12 z-50 w-auto rounded-md border border-gray-300 bg-white shadow-lg transition-all duration-200 ease-out">
            <Link 
              to="/general-settings"
              onClick={() => setIsUserDropdownOpen(false)}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Account Settings
            </Link>
            <Link 
              to="/orders"
              onClick={() => setIsUserDropdownOpen(false)}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Orders
            </Link>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        )}
        <div className="p-4">
          <SearchInput onItemSelect={handleSearchItemSelect}/>
        </div>

        {isMobileMenuOpen && (
          <div className="block bg-white md:hidden p-4 border-t ">
            <div className="flex flex-col w-full space-y-1">
              {isUserAuthenticated && (
                <div className="bg-blue-50 rounded-md p-2 mb-2">
                  <p className="text-sm text-blue-700">Welcome back, {displayName}!</p>
                </div>
              )}
              <ul className="flex flex-col space-y-1 text-4 font-medium">
                {renderMobileCategoryLinks()}
              </ul>
              
              <button 
                onClick={toggleFilter}
                className="flex items-center space-x-2 cursor-pointer hover:text-gray-600 transition-colors  py-2 border-t border-gray-200"
              >
                <RiEqualizerLine size={24}/>
                <span>Filter Products</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <FiltersComponent 
        isOpen={showFilter}
        onClose={toggleFilter}
        onApplyFilters={handleApplyFilters} initialFilters={undefined}      />
    </div>
  );
};

export default Header;