// ShoeCategory.tsx
import { useState } from "react";
import ShoeCategoryList from "./ShoeCategoryList";
import SortDropdown from "./SortButton";

const ShoeCategory = () => {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-24 py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-medium">Shoes</h1>
        <SortDropdown 
          selectedOption={selectedOption} 
          onSelectOption={setSelectedOption} 
        />
      </div>
      {/* Pass the selected sort option down */}
      <ShoeCategoryList selectedOption={selectedOption} />
    </div>
  );
};

export default ShoeCategory;
