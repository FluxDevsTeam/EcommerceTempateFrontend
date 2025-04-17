import { useState } from 'react';
import { FiShoppingBag, FiTruck, FiPackage, FiTrendingUp, FiTrendingDown, FiMenu, FiGrid } from "react-icons/fi";
import search from './img/shape.png'
import notis from './img/bell.png'
import Dropdown from "./Dropdown";
import shirt from "./img/shirt.png"

const AdminOrders = () => {
  const [layout, setLayout] = useState("menu");

  const items = [
    { name: "T-Shirts", quantity: 2, price: 23450 },
    { name: "Jeans", quantity: 2, price: 23450 },
    { name: "Sneakers", quantity: 2, price: 23450 },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className=" leading-[150%]">
      <div className="flex justify-between">
        <div>
          <h2 className="font-medium text-[28px] mb-2.5">Product Orders</h2>
          <p className="font-normal text-base text-[#7C8DB5] mb-6">Here is the information about all your orders</p>
        </div>
        <div className="flex items-start">
          <img src={search} className="w-[24px] mr-4" alt="search" />
          <img src={notis} className="w-[24px]" alt='notification' />
        </div>
      </div>
      
      <div className="flex justify-between items-center w-[75%] border border-[#E6EDFF] rounded-2xl p-6">
        <div className="w-[33%] border-r border-[#E6EDFF] pr-10">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-[28px] mr-auto">89,935</h4>
            <FiShoppingBag size={20} className="text-[#7C8DB5]" />
          </div>
          <p className="mb-2.5 font-normal">Total Orders</p>
          <p className="flex items-center">
            <FiTrendingUp className="text-[#34C759] mr-2.5" />
            <span className="text-[14px] mr-2.5">10.2</span>
            <span className="text-[14px]">+1.01% this week</span>
          </p>
        </div>

        <div className="w-[33%] border-r border-[#E6EDFF] pr-10 pl-5">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-[28px] mr-auto">23,283.5</h4>
            <FiPackage size={20} className="text-[#7C8DB5]" />
          </div>
          <p className="mb-2.5 font-normal">Cancelled Orders</p>
          <p className="flex items-center">
            <FiTrendingUp className="text-[#34C759] mr-2.5" />
            <span className="text-[14px] text-[#7C8DB5] mr-2.5">3.1</span>
            <span className="text-[14px]">+0.49% this week</span>
          </p>
        </div>

        <div className="w-[33%] border-r border-[#E6EDFF] pr-10 pl-5">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-[28px] mr-auto">46,827</h4>
            <FiTruck size={20} className="text-[#7C8DB5]" />
          </div>
          <p className="mb-2.5 font-normal">Total Delivered</p>
          <p className="flex items-center">
            <FiTrendingDown className="text-[#FF3B30] mr-2.5" />
            <span className="text-[14px] mr-2.5">2.56</span>
            <span className="text-[14px]">-0.91% this week</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 mt-10">
        <form className="mr-auto flex items-center gap-4 px-4 py-2.5 border border-[#CACACA] rounded-lg">
          <img src={search} alt="search" className="h-[18px] w-[18px]" />
          <input type="text" placeholder="Search" className="focus:outline-none focus:border-none" />
        </form>
        <div className="">
        <Dropdown
          label="All Categories"
          options={["Active", "Delivered"]}
          widthClass="w-50"
          onSelect={(value) => console.log("Selected:", value)}
        />

        </div>
        <div className="bg-black p-2 rounded-lg cursor-pointer" onClick={() => setLayout("menu")}>
          <FiMenu className="text-white w-[24px] h-[24px]" />
        </div>
        <div className="p-2 border border-[#CACACA] rounded-lg cursor-pointer" onClick={() => setLayout("grid")}>
          <FiGrid className="w-[24px] h-[24px]" />
        </div>
      </div>

      {layout === "menu" && (
      <div className="MENU mt-10 border border-[#E6EDFF] rounded-2xl py-4 px-6">
        <ul className="text-[12px] font-semibold leading-[150%] flex py-5 border-b border-[#E6EDFF]">
          <li className="flex gap-1 w-[10%]"><span>ID</span><span className="text-[10px] text-[#7C8DB5]">&#x2191;&#x2193;</span></li>
          <li className="w-[10%]">Date</li>
          <li className="flex gap-1 w-[20%]"><span>Product Name</span><span className="text-[10px] text-[#7C8DB5]">&#x2191;&#x2193;</span></li>
          <li className="w-[20%]">Address</li>
          <li className="flex gap-1 w-[10%]"><span>Price</span><span className="text-[10px] text-[#7C8DB5]">&#x2191;&#x2193;</span></li>
          <li className="w-[15%]">Estimated Delivery Date</li>
          <li className="flex gap-1 w-[10%]"><span>Status Order</span><span className="text-[10px] text-[#7C8DB5]">&#x2191;&#x2193;</span></li>
          <li className="w-[5%]">Action</li>
        </ul>
        
        <ul>
          <li className="text-[12px] font-semibold leading-[150%] flex py-5 border-b border-[#E6EDFF]">
            <p className="w-[10%]">#12594</p>
            <p className="w-[10%]">Dec 1, 2021</p>
            <p className="w-[20%]">Classic White T-Shirt,...</p>
            <p className="w-[20%]">312 S Wilmette Ave</p>
            <p className="w-[10%]">$847.69</p>
            <p className="w-[15%]">Dec 1, 2021</p>
            <p className="w-[10%] bg-[#34C75926] pl-3 mr-4 flex items-center gap-2 py-1 rounded-lg"><span className="block rounded-full w-2 h-2 bg-[#34C759]"></span><span>Active</span></p>
            <p className="w-[5%] text-center">View</p>
          </li>
          <li className="text-[12px] font-semibold leading-[150%] flex py-5 border-b border-[#E6EDFF]">
            <p className="w-[10%]">#12594</p>
            <p className="w-[10%]">Dec 1, 2021</p>
            <p className="w-[20%]">Classic White T-Shirt,...</p>
            <p className="w-[20%]">312 S Wilmette Ave</p>
            <p className="w-[10%]">$847.69</p>
            <p className="w-[15%]">Dec 1, 2021</p>
            <p className="w-[10%] bg-[#FF950026] pl-3 mr-4 flex items-center gap-2 py-1 rounded-lg"><span className="block rounded-full w-2 h-2 bg-[#FF9500]"></span><span>On Delivery</span></p>
            <p className="w-[5%] text-center">View</p>
          </li>
          <li className="text-[12px] font-semibold leading-[150%] flex py-5 border-b border-[#E6EDFF]">
            <p className="w-[10%]">#12594</p>
            <p className="w-[10%]">Dec 1, 2021</p>
            <p className="w-[20%]">Classic White T-Shirt,...</p>
            <p className="w-[20%]">312 S Wilmette Ave</p>
            <p className="w-[10%]">$847.69</p>
            <p className="w-[15%]">Dec 1, 2021</p>
            <p className="w-[10%] bg-[#34C75926] pl-3 mr-4 flex items-center gap-2 py-1 rounded-lg"><span className="block rounded-full w-2 h-2 bg-[#34C759]"></span><span>Active</span></p>
            <p className="w-[5%] text-center">View</p>
          </li>
          <li className="text-[12px] font-semibold leading-[150%] flex py-5 border-b border-[#E6EDFF]">
            <p className="w-[10%]">#12594</p>
            <p className="w-[10%]">Dec 1, 2021</p>
            <p className="w-[20%]">Classic White T-Shirt,...</p>
            <p className="w-[20%]">312 S Wilmette Ave</p>
            <p className="w-[10%]">$847.69</p>
            <p className="w-[15%]">Dec 1, 2021</p>
            <p className="w-[10%] bg-[#FF950026] pl-3 mr-4 flex items-center gap-2 py-1 rounded-lg"><span className="block rounded-full w-2 h-2 bg-[#FF9500]"></span><span>On Delivery</span></p>
            <p className="w-[5%] text-center">View</p>
          </li>
        </ul>
      </div>
      )}

      {layout === 'grid' && (
      <div className="GRID grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 sm:mb-16 mt-10">
        <div className='mb-10'>
          <div className="relative w-fit mb-4">
            <p className="absolute top-2 right-2 bg-[#FF950026] flex items-center gap-2 rounded-lg px-4"><span className="block rounded-full w-2 h-2 bg-[#FF9500]"></span><span className="text-[12px]">On Delivery</span></p>
            <img src={shirt} alt='shirt' className="rounded-3xl" />
          </div>
          <p className="text-base sm:text-[20px] mb-2">Classic White T-Shirt</p>
          <div className="flex gap-2 sm:gap-4">
            <span className="text-[20px] sm:text-[20px]">$847.69</span>
            <span className="text-[20px] sm:text-[16px] text-[#00000066] line-through">207.69</span>
            <span className="bg-[#72D3E940] text-[10px] sm:text-[14px] flex justify-between items-center rounded-3xl py-0.5 px-6">Total</span>
          </div>
        </div>
        <div className='mb-10'>
          <div className="relative w-fit mb-4">
          <p className="absolute top-2 right-2 bg-[#34C75926] flex items-center gap-2 rounded-lg px-4"><span className="block rounded-full w-2 h-2 bg-[#34C759]"></span><span className="text-[12px]">Active</span></p>
            <img src={shirt} alt='shirt' className="rounded-3xl" />
          </div>
          <p className="text-base sm:text-[20px] mb-2">Classic White T-Shirt</p>
          <div className="flex justify-between">
            <span className="text-[20px] sm:text-[20px]">$847.69</span>
            <span className="text-[20px] sm:text-[16px] text-[#00000066] line-through">207.69</span>
            <span className="bg-[#72D3E940] text-[14px] rounded-3xl py-0.5 px-6">Total</span>
          </div>
        </div>
        <div className='mb-10'>
          <div className="relative w-fit mb-4">
            <p className="absolute top-2 right-2 bg-[#FF950026] flex items-center gap-2 rounded-lg px-4"><span className="block rounded-full w-2 h-2 bg-[#FF9500]"></span><span className="text-[12px]">On Delivery</span></p>
            <img src={shirt} alt='shirt' className="rounded-3xl" />
          </div>
          <p className="text-base sm:text-[20px] mb-2">Classic White T-Shirt</p>
          <div className="flex justify-between">
            <span className="text-[20px] sm:text-[20px]">$847.69</span>
            <span className="text-[20px] sm:text-[16px] text-[#00000066] line-through">207.69</span>
            <span className="bg-[#72D3E940] text-[14px] rounded-3xl py-0.5 px-6">Total</span>
          </div>
        </div>
        <div className='mb-10'>
          <div className="relative w-fit mb-4">
            <p className="absolute top-2 right-2 bg-[#34C75926] flex items-center gap-2 rounded-lg px-4"><span className="block rounded-full w-2 h-2 bg-[#34C759]"></span><span className="text-[12px]">Active</span></p>
            <img src={shirt} alt='shirt' className="rounded-3xl" />
          </div>
          <p className="text-base sm:text-[20px] mb-2">Classic White T-Shirt</p>
          <div className="flex justify-between">
            <span className="text-[20px] sm:text-[20px]">$847.69</span>
            <span className="text-[20px] sm:text-[16px] text-[#00000066] line-through">207.69</span>
            <span className="bg-[#72D3E940] text-[14px] rounded-3xl py-0.5 px-6">Total</span>
          </div>
        </div>
      </div>
      )}

      <div className='bg-amber-100 w-[80%] p-4 m-10'>
        <h3 className='text-[18px] leading-[150%] mb-3 font-medium'>Order ORD-001</h3>
        <p className='text-[14px] mb-4 font-medium'>Placed on 2025-04-5 by John Doe</p>
        <p className='text-[14px] font-semibold mb-3'>Customer’s Details</p>
        <div className='grid grid-cols-3 gap-y-3'>
          <p className='flex items-center gap-3 text-[14px]'><span className='font-medium'>First Name:</span><span>John</span></p>
          <p className='flex items-center gap-3 text-[14px]'><span className='font-medium'>Last Name:</span><span>Doe</span></p>
          <p className='flex items-center gap-3 text-[14px]'><span className='font-medium'>Delivery Address:</span><span>11, Maercarty way</span></p>
          <p className='flex items-center gap-3 text-[14px]'><span className='font-medium'>Email:</span><span> Johndoe@gmail.com</span></p>
          <p className='flex items-center gap-3 text-[14px]'><span className='font-medium'>City/Region:</span><span>Nigeria</span></p>
          <p className='flex items-center gap-3 text-[14px]'><span className='font-medium'>Estimated Delivery:</span><span>5th - 7th July 2025</span></p>
          <p className='flex items-center gap-3 text-[14px]'><span className='font-medium'>Phone Number:</span><span>+2234400012</span></p>
        </div>

        <div className='mt-10 flex justify-between items-center'>
          <div className=''>
            <p className='text-[14px] font-medium'>Status</p>
            <Dropdown
              label="Status"
              options={["Active", "Delivered"]}
              widthClass="w-40"
              menuBgClass="bg-[#34C75926]"
              onSelect={(value) => console.log("Selected:", value)}
            />
          </div>
          <div className='text-[14px]'>
            <p className='font-medium'>Total Delivery Fee</p>
            <p className='font-bold'>#27,734.40</p>
          </div>
        </div>

        <div className="text-[#333333] text-[14px] mt-10">
      <p className="flex items-center bg-[#DADADA80] text-[#333333] font-medium p-4 rounded-lg">
        <span className="w-[25%]">Products</span>
        <span className="w-[25%]">Quantity</span>
        <span className="w-[25%]">Price</span>
        <span className="w-[25%]">Total</span>
      </p>

      {items.map((item, index) => (
        <p
          key={index}
          className="flex items-center text-[#333333] font-medium py-3 rounded-lg mt-4"
        >
          <span className="w-[25%]">{item.name}</span>
          <span className="w-[25%]">{item.quantity}</span>
          <span className="w-[25%]">N{item.price.toLocaleString()}</span>
          <span className="w-[25%]">N{item.price.toLocaleString()}</span>
        </p>
      ))}

      <p className="flex items-center justify-end text-[#333333] font-bold py-3 rounded-lg mt-4">
        <span className="w-[25%]">Subtotal</span>
        <span className="w-[25%]">N{subtotal.toLocaleString()}</span>
      </p>
    </div>
      </div>
    </div>
  )
}

export default AdminOrders