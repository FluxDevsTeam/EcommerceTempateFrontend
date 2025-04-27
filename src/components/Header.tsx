import { useEffect, useRef, useState } from "react";
import { BsCart } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoPersonCircleOutline } from "react-icons/io5";
import FiltersComponent from "@/pages/filters/Filter";
import SortDropdown from "./SortDropdown";
import { Link, useNavigate } from "react-router-dom";
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
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log("Header render:", { 
    isAuthenticated, 
    currentUser,
    hasFirstName: currentUser?.first_name ? true : false,
    localStorage: {
      accessToken: !!localStorage.getItem('accessToken'),
      refreshToken: !!localStorage.getItem('refreshToken'),
      user: localStorage.getItem('user')
    }
  });
  
  const lastScrollY = useRef<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);

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

  // Create display name function to ensure consistency
  const getDisplayName = () => {
    if (isAuthenticated && currentUser?.first_name) {
      return currentUser.first_name;
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

  // Get user display name once to use consistently
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
              <Link 
                to={isAuthenticated ? '/account' : '/login'} 
                className="flex items-center gap-2 hover:text-gray-600 transition-colors"
              >
                {displayName ? (
                  <span className="text-sm font-medium bg-blue-100 px-2 py-1 rounded">
                    {displayName}
                  </span>
                ) : (
                  <span className="text-sm">Sign In</span>
                )}
                <IoPersonCircleOutline size={35}/>
              </Link>
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
              <Link 
                to={isAuthenticated ? '/account' : '/login'} 
                className="flex items-center gap-2 hover:text-gray-600 transition-colors"
              >
                {displayName && (
                  <span className="text-sm font-medium bg-blue-100 px-2 py-1 rounded">{displayName}</span>
                )}
                <IoPersonCircleOutline size={35}/>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="block md:hidden p-7">
            <div className="flex flex-col w-full space-y-4">
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
      <div className={`h-${scrolled ? '28' : '24'} md:h-${scrolled ? '32' : '28'}`}></div>

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