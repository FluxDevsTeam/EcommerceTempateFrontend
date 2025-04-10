import { useEffect, useRef, useState } from "react";
import { BsCart } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoPersonCircleOutline } from "react-icons/io5";
import FiltersComponent from "@/pages/categories/Filter";
import { SortDropdown } from "./SortDropdown";
import { Link } from "react-router-dom";
import { RiEqualizerLine } from "react-icons/ri";
import SearchInput from "./SearchInput";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  
  const lastScrollY = useRef<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled class when user scrolls down
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchItemSelect = (): void => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

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
            <div className="flex space-x-4">
              <BsCart size={30}/>
              <IoPersonCircleOutline size={35}/>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <ul className="flex space-x-6 text-[16px] font-medium font-poppins">
              <Link to='/categories'><li>New Arrivals</li></Link>  
              <li>Shoes</li>
              <li>Accesories</li>
              <li>Watches</li>
              <li>More</li>
            </ul>
            <SearchInput onItemSelect={handleSearchItemSelect}/>
            <SortDropdown/>
            <button 
              onClick={toggleFilter}
              className="cursor-pointer"
            >
              <RiEqualizerLine size={30}/>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="block md:hidden">
          <div className="flex justify-between items-center px-4">
            <div className="flex space-x-3 items-center">
              <button className="focus:outline-none" onClick={toggleMenu}>
                {!isOpen ? <AiOutlineMenu size={30} /> : <AiOutlineClose size={30}/>}
              </button>
              <Link to='/'><p className="font-bold text-3xl">SHOP.CO</p></Link>
            </div>
            <div className="flex space-x-4">
              <BsCart size={30}/>
              <IoPersonCircleOutline size={35}/>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="block md:hidden p-7">
            <div className="flex flex-col w-full space-y-4">
              <ul className="flex flex-col space-y-5 text-[16px] font-medium leading-[100%]">
                <Link to='/categories'><li>New Arrivals</li></Link>
                <li>Shoes</li>
                <li>Accesories</li>
                <li>Watches</li>
                <li>More</li>
              </ul>
              <SearchInput onItemSelect={handleSearchItemSelect}/>
              <div className="flex space-x-3">
                <SortDropdown/>
                <button 
                  onClick={toggleFilter}
                  className="cursor-pointer"
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

      {/* Filter Component */}
      <FiltersComponent 
        isOpen={showFilter} 
        onClose={toggleFilter} 
      />
    </>
  );
};

export default Header;