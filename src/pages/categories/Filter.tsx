import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { IoClose } from "react-icons/io5";

const FiltersComponent = ({ isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState([50, 200]);
  const [selectedSize, setSelectedSize] = useState('Large');
  
  const subcategories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'];
  const sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];
  
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  
  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const handleApplyFilter = () => {
    // Add your filter application logic here
    onClose(); // Close the sidebar after applying filters
  };
  
  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-lg w-80 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 cursor-pointer">
            <IoClose size={24} />
          </button>
        </div>
        
        <Accordion type="single" collapsible className="w-full border-t border-gray-200" defaultValue="subcategory">
          <AccordionItem value="subcategory" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 font-semibold cursor-pointer">Subcategory</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 py-1">
                {subcategories.map((category) => (
                  <li key={category} className="text-gray-600 hover:text-black cursor-pointer">{category}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="price" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 font-semibold cursor-pointer">Price</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-6">
                <Slider
                  defaultValue={[50, 200]}
                  max={400}
                  step={1}
                  onValueChange={handlePriceChange}
                  className="mt-6 bg-black cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">${priceRange[0]}</span>
                  <span className="text-gray-600">${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="size" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 font-semibold cursor-pointer">Size</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-2 pb-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => handleSizeClick(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="color" className="border-b border-gray-200">
            <AccordionTrigger className="py-4 font-semibold  cursor-pointer">Color</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-3 pt-2 pb-4">
                <div className="w-6 h-6 rounded-full bg-black border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-blue-600 border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-red-600 border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-green-600 border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-yellow-400 border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-purple-600 border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 cursor-pointer"></div>
                <div className="w-6 h-6 rounded-full bg-white border border-gray-300 cursor-pointer"></div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="px-6 pb-6 mt-4">
        <div className="flex gap-3">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="w-1/2 border border-black text-black rounded-full cursor-pointer font-medium hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApplyFilter} 
            className="w-1/2 bg-black text-white rounded-full font-medium cursor-pointer hover:bg-black/90"
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersComponent;