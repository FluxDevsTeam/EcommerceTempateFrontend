import AccessoriesCategoryList from "./AccessoriesCategoryList";
import SortDropdown from "./SortButton";
import { useState } from "react";

const AccessoriesCategory = () => {
  const [sortOption, setSortOption] = useState('');
  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-24 py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-4xl text-xl font-medium">Accessories</h1>
        <SortDropdown 
         selectedOption={sortOption}
         onSelectOption={setSortOption}
        />
      </div>
      <AccessoriesCategoryList sortOption={sortOption} />
    </div>
  );
};

export default AccessoriesCategory;
