// Categories.tsx
import { useState } from 'react';
import NewProductsList from "./NewProductsList";
import SortDropdown from "./SortButton"; // not SortButton

const Categories = () => {
  const [sortOption, setSortOption] = useState('Latest items');

  return (
    <div className="w-full min-h-full flex flex-col my-6 pt-6 md:px-24 px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-medium">Wishlist</h1>
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
