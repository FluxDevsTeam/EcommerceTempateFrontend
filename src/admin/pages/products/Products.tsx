import { useState } from "react";
import ProductsGrid from "./product components/Product-Grid";
import ProductListTableView from "./product components/Product-List-Table-View";

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const toggleView = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  return (
    <div className="w-full">
      {viewMode === "list" ? (
        <ProductListTableView 
          isVisible={true}
          onViewChange={toggleView}
          currentView={viewMode}
        />
      ) : (
        <ProductsGrid 
          isVisible={true}
          onViewChange={toggleView}
          currentView={viewMode}
        />
      )}
    </div>
  );
}

export default Products;