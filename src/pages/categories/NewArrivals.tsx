// Categories.tsx
import { useState } from 'react';
import NewProductsList from "./NewProductsList";
import SortDropdown from "./SortButton"; 

const NewArrivals = () => {
  const [sortOption, setSortOption] = useState<string>('Latest items');

  return (
    <div className="w-full min-h-full flex flex-col px-6  md:px-24  py-8 md:py-12 ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold capitalize">New Arrivals</h1>

        <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <SortDropdown 
          selectedOption={sortOption}
          onSelectOption={setSortOption}
        />    
      </div></div>
      <NewProductsList sortOption={sortOption} />
    </div>
  );
};

export default NewArrivals;
