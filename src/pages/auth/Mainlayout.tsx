import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumb";
import WhatsAppFloat from "@/components/WhatsAppFloat";


const MainLayout: React.FC = () => {
    return (
      <div className="min-h-screen flex flex-col">
    <Header />
  
        <main className="flex-1 mt-[90px] md:mt-28">  
        <div className='md:block hidden'>    <Breadcrumbs/> </div>
          <Outlet /> 
        </main>
        <WhatsAppFloat />
        <Footer />
      </div>
    );
  };

  export default MainLayout