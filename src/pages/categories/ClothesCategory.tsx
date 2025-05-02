import { useState } from 'react';
import ClothesCategoryList from "./ClothesCategoryList";
import SortDropdown from "./SortButton";

const ClothesCategory = () => {
  const [selectedOption, setSelectedOption] = useState('');  // <-- ADD this state

  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-24 py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-4xl text-xl font-medium">Clothes</h1>
        <SortDropdown 
          selectedOption={selectedOption} 
          onSelectOption={setSelectedOption} 
        />
      </div>
      <ClothesCategoryList selectedOption={selectedOption} /> {/* Pass it down */}
    </div>
  );
}

export default ClothesCategory;
