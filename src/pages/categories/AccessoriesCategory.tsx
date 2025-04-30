import AccessoriesCategoryList from "./AccessoriesCategoryList";
import SortDropdown from "./SortButton";

const AccessoriesCategory = () => {
  return (
    <div className="w-full min-h-full flex flex-col px-6 md:px-24 py-8 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-medium">Accessories</h1>
        <SortDropdown />
      </div>
      <AccessoriesCategoryList />
    </div>
  );
};

export default AccessoriesCategory;
