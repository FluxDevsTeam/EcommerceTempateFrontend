
import { IoIosArrowDown } from "react-icons/io"




const products = () => {
  return (
    <div className="mt-8">
        <div>
             <button className="p-3  w-[121px] bg-white text-black border rounded-2xl border-black flex items-center space-x-2"><span>Sort by</span> 
             <span className=""><IoIosArrowDown/></span></button>
             <p className="text-[48px] font-medium leading-[100%] flex justify-center ">Latest Items</p>
        </div>
    </div>
  )
}

export default products