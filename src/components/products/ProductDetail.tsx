import Suggested from "./Suggested";
import DescriptionList from "./DescriptionList";

const ProductDetail = () => {
  return (
    <div className="w-full min-h-screen px-4 sm:px-8 md:px-12 lg:px-24 my-6 md:my-10">
      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
        {/* Thumbnail Images (Left Column) */}
        <div className="flex mx-auto md:flex-col gap-5 order-1">
          {[
            "https://picsum.photos/400/300",
            "https://picsum.photos/200/540",
            "https://picsum.photos/435/324"
          ].map((img, index) => (
            <div key={index} className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:opacity-90">
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Product Image (Middle Column) */}
        <div className="bg-gray-200 rounded-lg p-4 sm:p-6 flex-1 max-w-[500px]  lg:order-2">
          <img
            src="https://picsum.photos/435/324"
            alt="Main Product"
            className="w-full h-auto aspect-square object-cover"
          />
        </div>

        {/* Product Info (Right Column) */}
        <div className="flex-1 max-w-[600px] order-2 lg:order-3">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium leading-tight">
              One Life Graphic T-Shirt
            </h1>
            
            <span className="inline-block bg-[#72D3E9] text-sm md:text-base rounded-2xl py-1 px-3">
              5 left in stock
            </span>
            
            <div className="flex items-center gap-3">
              <span className="text-xl md:text-2xl font-bold">$500</span>
              <span className="text-gray-500 line-through text-lg">$200</span>
              <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">
                10% off
              </span>
            </div>
            
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              This shirt is made of synthetic fiber which can last for years, available offers start right here
            </p>
            
            <div className="space-y-1">
              <p className="text-gray-600 text-sm sm:text-base">Color</p>
              <p className="text-gray-900 font-bold">Teal</p>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <button className="p-2 sm:p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                -
              </button>
              <span className="text-lg">1</span>
              <button className="p-2 sm:p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                +
              </button>
            </div>
            
            {/* Size Selector */}
            <div className="grid grid-cols-4 gap-2">
              {['Small', 'Medium', 'Large', 'X Large'].map((size) => (
                <button
                  key={size}
                  className={`p-2 text-sm sm:text-base border rounded-2xl transition-colors ${
                    size === 'Large'
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-200 hover:bg-gray-300 border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            
            {/* Add to Cart */}
            <button className="w-full py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-12 space-y-6">
        <h2 className="text-xl sm:text-2xl font-medium">Description</h2>
        <p className="text-gray-700 text-sm sm:text-base">
          This is a vintage product produced by Versace under their label, Medusa. It offers an authentic blend of modern and antique.
        </p>
        <DescriptionList />
        <Suggested />
      </div>
    </div>
  );
};

export default ProductDetail;