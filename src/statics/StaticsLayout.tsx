import React, { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";

const StaticsLayout: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <div className="min-h-screen flex flex-col">
    <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
  
        <main className="">  
        {/* <div className='md:block hidden'>    <Breadcrumbs/> </div> */}
          <Outlet /> 
        </main>
        {/* <WhatsAppFloat /> */}
        <Footer />
      </div>
    );
  };

  export default StaticsLayout