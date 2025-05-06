import image1 from "/images/Frame 1618876995 (1).png";
import ImageGrid from "./components/ImageGrid";
import TopSelling from "./components/TopSelling";
import ImageSlider from "./components/ImageSlider";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./api/apiService";
import { ProductAPIResponse } from "./types/data-types";
import { Link } from "react-router-dom";


const Homepage = () => {

  const { data, isLoading, isError } = useQuery<ProductAPIResponse>({
    queryKey: ['myData'],
    queryFn: fetchProducts
  });
  

if (isLoading) return <div className="flex justify-center items-center py-10 text-lg">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>

</div>;
if (isError) return <div>Error loading data.</div>;

  return (
    <div className="w-full min-h-full px-4  md:px-12 py-4 lg:px-20 ">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        <div className="flex flex-col space-y-2 pt-3 md:pt-6  px-4 md:px-0">
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold leading-tight lg:leading-[63px] text-black'>
            Shop Smarter, Live Better - Find What You Love
          </h1>
          <p className='text-[#000000] font-medium text-base md:text-lg'>
            Access exclusive deals, track orders and enjoy a seamless shopping experience
          </p>
        <Link to='/shoe-category'>  <button className="bg-black text-white border rounded-full px-6 py-3 w-[210px] hover:bg-gray-800 transition-colors">
            Shop Now
          </button>
          </Link>
        </div>
        
        <div className="flex justify-center lg:justify-end lg:mt-[-20px] ">
          <img 
            src={image1} 
            alt="Banner image" 
            className="w-full md:max-w-lg max-w-sm object-contain"
          />
        </div>
      </div>

      {/* Content Sections */}
      <div className="md:mt-3  md:space-y-10">
        
     <ImageGrid  product={data?.latest_items?.results ?? []} />
     <TopSelling product={data?.top_selling_items?.results ?? []} />
     <ImageSlider data={data?.latest_items?.results ?? []}/>
     
      </div>
    </div>
  )
}

export default Homepage;