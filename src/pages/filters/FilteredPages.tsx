import { useLocation } from 'react-router-dom';


const FilteredProducts = () => {
  const location = useLocation();
  const products = location.state?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Filtered Products</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No products match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={product.image1} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-bold">${product.discounted_price}</span>
                  {product.discounted_price !== product.price && (
                    <span className="text-gray-500 line-through">${product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilteredProducts;