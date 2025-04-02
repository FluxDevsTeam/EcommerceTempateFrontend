import image1 from "/images/Frame 1618876995 (1).png"
import Products from "./components/products"
import ImageGrid from "./components/ImageGrid"
import TopSelling from "./components/TopSelling"
import ImageSlider from "./components/ImageSlider"

const Homepage = () => {
  return (
    <div className="w-full min-h-full px-24">
      <div className="grid grid-cols-2 gap-6 ">
        <div className="flex flex-col space-y-6 pt-12 ">
        <p className='text-[64px] font-bold leading-[63px] text-black'>Shop Smarter , Live Better - Find What you Love</p>
        <p className='text-[#000000 font-medium text-5'>Access exclusive deals , track orders and enjoy a seamless shopping experience </p>
        <button className="bg-black text-white border rounded-full p-3 w-[210px]">Shop Now</button>
        </div>
        
        <div >
          <img src={image1} alt="Banner image"   />

        </div>
      </div>
      <Products/>
      <ImageGrid />
      <TopSelling />
      <ImageSlider/>
     
    </div>
  )
}

export default Homepage