import React from 'react';
import { Link } from 'react-router-dom';
import kdcLogo from '../assets/kdcLogo.png';

const Header = ({ setIsMenuOpen, isMenuOpen }: { setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>, isMenuOpen: boolean }) => {
    const MobileMenu = () => (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="bg-black text-white text-xs text-center py-3 px-4 relative">
                <span>
                    Sign up and get 20% off to your first order. <a href="#" className="underline font-semibold">Sign Up Now</a>
                </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <button onClick={() => setIsMenuOpen(false)} className="self-start mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <nav className="flex flex-col space-y-7">
                    <Link to="/services" className="text-2xl text-gray-800" onClick={() => setIsMenuOpen(false)}>Our Services</Link>
                    <Link to="/industries" className="text-2xl text-gray-800" onClick={() => setIsMenuOpen(false)}>Industries we work with</Link>
                    <Link to="/consultation" className="text-2xl text-gray-800" onClick={() => setIsMenuOpen(false)}>Consultation</Link>
                    <Link to="/blogs" className="text-2xl text-gray-800" onClick={() => setIsMenuOpen(false)}>Blogs</Link>
                    <Link to="/plans" className="text-2xl text-gray-800" onClick={() => setIsMenuOpen(false)}>Pricing Plan</Link>
                </nav>
                <div className="mt-12">
                    <a href="#" className="bg-[#0093A7] text-white font-bold py-4 px-12 rounded-lg text-base inline-block">Shop Now</a>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isMenuOpen && <MobileMenu />}
            <header className="bg-white relative">
                <div className="bg-[#F8F3EF] text-center py-2 text-xs text-gray-800">
                    Sign up and get 20% off to your first order. <a href="#" className="underline font-semibold">Sign Up Now</a>
                </div>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4 md:gap-0">
                        <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                        <div className="w-16">
                            <img src={kdcLogo} alt="Okids Design Company" />
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/services" className="text-gray-800 hover:text-[#0080A0] transition-colors">Our Services</Link>
                        <Link to="/industries" className="text-gray-800 hover:text-[#0080A0] transition-colors">Industries we work with</Link>
                        <Link to="#" className="text-gray-800 hover:text-[#0080A0] transition-colors">Consultation</Link>
                        <Link to="#" className="text-gray-800 hover:text-[#0080A0] transition-colors">Blogs</Link>
                        <Link to="#" className="text-gray-800 hover:text-[#0080A0] transition-colors">Pricing Plan</Link>
                    </nav>
                    <a href="#" className="bg-[#0080A0] text-white font-bold py-2 px-7 rounded-lg text-sm hover:bg-[#006080] transition-colors">Shop Now</a>
                </div>
            </header>
        </>
    );
};

export default Header;