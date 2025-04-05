import { FaRegHeart } from "react-icons/fa";

const generateData = () => {
  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    title: `Hard Generator`,
    price: 240,
    originalPrice: 260,
    discount: "-20%",
    image: `https://picsum.photos/405/200?random=${index + 1}`,
  }));
};

const CategoryProducts = () => {
  const data = generateData();
  
  return (
    <div className="px-4 sm:px-6 py-6 md:py-8">
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
        {data.map((item) => (
          <div key={item.id} className="group hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
            <div className="bg-[#F0EEED] rounded-lg p-8 relative">
              <div className="" >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-auto aspect-square object-cover"
                />
                <button 
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-2 transition-colors duration-200"
                  aria-label="Add to favorites"
                >
                  <FaRegHeart size={15} />
                </button>
              </div>
            </div>
            
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 line-clamp-2">
                {item.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="text-lg sm:text-xl font-bold">${item.price}</span>
                <span className="text-gray-500 line-through text-sm sm:text-base">
                  ${item.originalPrice}
                </span>
                <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                  {item.discount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;