// Categories.tsx
import { useState } from 'react';
import NewProductsList from "./NewProductsList";
import SortDropdown from "./SortButton"; 

const Categories = () => {
  const [sortOption, setSortOption] = useState('');

  return (
    <div className="w-full min-h-full flex flex-col px-6  md:px-24  py-8 md:py-12 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-4xl text-xl font-medium">New Arrivals</h1>
        <SortDropdown 
          selectedOption={sortOption}
          onSelectOption={setSortOption}
        />    
      </div>
      <NewProductsList sortOption={sortOption} />
    </div>
  );
};

export default Categories;
