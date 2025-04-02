import { BsCart } from "react-icons/bs"
import { FiSearch } from "react-icons/fi"
import { IoIosArrowDown } from "react-icons/io"
import {AiOutlineMenu,AiOutlineClose} from 'react-icons/ai'
import { useState } from "react"
import { IoPersonCircleOutline } from "react-icons/io5"

const Header = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full md:px-24 py-6  ">

      <div className="hidden md:block">
      <div className="flex justify-between items-center my-6 ">
        <p className="text-[32px] font-medium leading-[100%] font-poppins ">SHOP.CO</p> 
        <div className="flex space-x-4">
          < BsCart size={30}/>
          < IoPersonCircleOutline size={35}/>
        </div>
        </div>
        <div className="flex justify-between items-center">
          <ul className="flex space-x-6 text-[16px] font-medium leading-[100%] font-poppins ">
            <li>New Arrivals</li>
            <li>Shoes</li>
            <li>Accesories</li>
            <li>Watches</li>
            <li>More</li>
            </ul>
            <div className="w-[435px] h-[48px] border rounded-lg bg-white border-black flex jutify-between items-center px-4 gap-3">
  <FiSearch className="text-gray-500" />
  <input 
    type="text" 
    placeholder="Search for items" 
    className="w-full h-full outline-none bg-transparent placeholder-gray-500"
  />
</div>
            <button className="p-3 w-[121px] bg-white text-black border rounded-2xl border-black flex items-center space-x-2"><span>Sort by</span> 
              <span className=""><IoIosArrowDown/></span></button>
            <button className="p-3 bg-black text-white border rounded-2xl border-black w-[121px]">Apply now</button>
          </div>
          </div>

          <div className="block md:hidden flex justify-around items-center">
            <div className="flex space-x-3">
 <button className=" " onClick={toggleMenu}>
    {!isOpen ? <AiOutlineMenu  size={25} /> : <AiOutlineClose size={25}/> }
  </button>
  <p className="text-[25px] font-medium leading-[100%]">SHOP.CO</p> 
  </div>
  <div className="flex space-x-3">  
        <div className="flex space-x-4">
          < BsCart size={25}/>
        < IoPersonCircleOutline size={25}/>
        </div>
        </div>
        </div>

  {isOpen &&  (
    <div className="block md:hidden p-7">
    
        <div className="flex flex-col w-full space-y-4">
          <ul className="flex flex-col space-y-5 text-[16px] font-medium leading-[100%]">
            <li>New Arrivals</li>
            <li>Shoes</li>
            <li>Accesories</li>
            <li>Watches</li>
            <li>More</li>
            </ul>
            <div className="w-[100%] h-[48px] border rounded-lg bg-white border-black flex jutify-between items-center px-4 gap-3">
  <FiSearch className="text-gray-500" />
  <input 
    type="text" 
    placeholder="Search for items" 
    className="w-full h-full outline-none bg-transparent placeholder-gray-500"
  />
</div>
<div className="flex space-x-3">
            <button className="p-3  w-[121px] bg-white text-black border rounded-2xl border-black flex items-center space-x-2"><span>Sort by</span> 
              <span className=""><IoIosArrowDown/></span></button>
            <button className="p-3 bg-black text-white border rounded-2xl border-black  w-[121px]">Apply now</button>
            </div>
          </div>
      </div>
  )}
    </div>
  )
}

export default Header