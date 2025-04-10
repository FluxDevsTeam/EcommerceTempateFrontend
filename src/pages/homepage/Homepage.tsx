import image1 from "/images/Frame 1618876995 (1).png";
import ImageGrid from "./components/ImageGrid";
import TopSelling from "./components/TopSelling";
import ImageSlider from "./components/ImageSlider";

const Homepage = () => {
  return (
    <div className="w-full min-h-full px-4 sm:px-6 md:px-12 py-4 lg:px-24">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        <div className="flex flex-col md:space-y-2 space-y-4  md:pt-6 pt-10 px-4 md:px-0">
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold leading-tight lg:leading-[63px] text-black'>
            Shop Smarter, Live Better - Find What You Love
          </h1>
          <p className='text-[#000000] font-medium text-base md:text-lg'>
            Access exclusive deals, track orders and enjoy a seamless shopping experience
          </p>
          <button className="bg-black text-white border rounded-full px-6 py-3 w-[210px] hover:bg-gray-800 transition-colors">
            Shop Now
          </button>
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
      <div className="md:mt-3 mt-12 space-y-10">
        
        <ImageGrid />
        <TopSelling />
        <ImageSlider/>
      </div>
    </div>
  )
}

export default Homepage;