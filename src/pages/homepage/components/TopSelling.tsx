

import { FaRegHeart } from "react-icons/fa";


const generateData = () => {
  return Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    title: `Port Generator`,
    price: 240,
    originalPrice: 260,
    discount: "-20%",
    image: `https://picsum.photos/405/200?random=${index + 1}`,
  }));
};

const TopSelling = () => {
  const data = generateData();
  
  return (
    <div className="p-6"> 
      <p className="text-[48px] font-medium leading-[100%] flex justify-center p-6">Top Selling Items</p> 
    <div className="grid grid-cols-2  lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <div key={item.id} >
        <div  className="bg-[#F0EEED] rounded-lg p-12  relative">
          <div className="">
            <img src={item.image} alt={item.title} className="w-full  h-[200px]" />
            <button className="absolute top-2 right-2 text-black  p-2 ">
              <FaRegHeart  size={20} />
            </button>
          </div></div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
            <div className="mt-2 flex items-center">
              <span className="text-xl font-bold">${item.price}</span>
              <span className="ml-2 text-gray-500 line-through text-lg">${item.originalPrice}</span>
              <span className="ml-2 bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">{item.discount}</span>
            </div>
          </div></div>
        
      ))}
    </div>
    <p className="flex justify-center items-center mt-6 text-lg font-semibold cursor-pointer">View All</p>
    </div>
  );
};

export default TopSelling