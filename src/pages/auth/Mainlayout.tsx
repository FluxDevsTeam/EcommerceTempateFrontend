import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";


const MainLayout: React.FC = () => {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 md:mt-24 mt-12">
          <Outlet /> 
        </main>
        <Footer />
      </div>
    );
  };

  export default MainLayout