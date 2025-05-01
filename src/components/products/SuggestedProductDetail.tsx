import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  total_quantity: number;
  sub_category: SubCategory;
  colour: string;
  image1: string;
  image2: string;
  image3: string;
  discounted_price: string;
  price: string;
  is_available: boolean;
  dimensional_size: string;
  weight: string;
  latest_item?: boolean;
  latest_item_position?: number | null;
  top_selling_items?: boolean;
  top_selling_position?: number | null;
  date_created?: string;
  date_updated?: string;
}

interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Fetch all products
const fetchProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch("https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/");
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

// Fetch suggested products
const fetchSuggestedProducts = async (subCategoryId: number): Promise<ProductsResponse> => {
  const response = await fetch(
    `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/suggestions/?sub_category_id=${subCategoryId}`
  );
  if (!response.ok) throw new Error("Failed to fetch suggested products");
  return response.json();
};

const SuggestedProductDetails = () => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };

  const {
    data: allProductsData,
    isLoading: isLoadingAllProducts,
    error: allProductsError
  } = useQuery<ProductsResponse, Error>({
    queryKey: ["allProducts"],
    queryFn: fetchProducts,
  });

  const firstProductSubCategoryId = allProductsData?.results?.[0]?.sub_category?.id;

  const {
    data: suggestedProductsData,
    isLoading: isLoadingSuggested,
    error: suggestedError
  } = useQuery<ProductsResponse, Error>({
    queryKey: ["suggestedProducts", firstProductSubCategoryId],
    queryFn: () => firstProductSubCategoryId ? fetchSuggestedProducts(firstProductSubCategoryId) : Promise.reject("No subcategory ID"),
    enabled: !!firstProductSubCategoryId,
  });

  const isLoading = isLoadingAllProducts || isLoadingSuggested;
  const error = allProductsError || suggestedError;
  const products = suggestedProductsData?.results || allProductsData?.results || [];

  if (isLoading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
  if (!products.length) return <div className="text-center py-8">No products found</div>;

  return (
    <div className="px-6 md:px-14 py-8 md:py-12">
      <h2 className="text-3xl md:text-4xl font-medium leading-tight text-center mb-6 sm:mb-8 md:mb-10">
        You might also Like
      </h2>

      <Slider {...settings} className="mb-8 sm:mb-16">
        {products.map((item) => {
          const price = parseFloat(item.price);
          const discountedPrice = parseFloat(item.discounted_price);
          const amountSaved = price - discountedPrice;

          return (
            <div key={item.id} className="px-2">
              <div
                className="group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/item/${item.id}`)}
              >
                <div className="rounded-lg relative">
                  <img
                    src={item.image1}
                    alt={item.name}
                    className="w-full h-[200px] md:h-[300px] shadow-lg object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-2 transition-colors duration-200"
                    aria-label="Add to favorites"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Favorite logic here
                    }}
                  >
                    <FaRegHeart size={15} />
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-base leading-[100%] sm:text-lg font-normal truncate">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="text-xl font-normal leading-[100%] text-primary">
                      ₦{discountedPrice.toFixed(0)}
                    </span>
                    <span className="text-gray-500 line-through text-xl sm:text-xl">
                      ₦{price.toFixed(0)}
                    </span>
                    <span className="bg-red-200 text-[#FF3333] px-2 py-1 rounded-full text-xs sm:text-sm">
                      ₦{amountSaved.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      <div className="flex justify-center items-center mt-8 sm:mt-10">
        <button
          onClick={() => navigate("/categories")}
          className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default SuggestedProductDetails;
