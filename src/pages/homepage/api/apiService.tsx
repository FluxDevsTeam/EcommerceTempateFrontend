import { Product } from '../types';

// Interface for API response
interface ApiResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// Interface for product (adjust based on your API's product structure)
interface Product {
  id: number;
  name: string;
  price: number;
  image1: string;
  // Add other fields as needed
}

// Base API URL
const BASE_URL = 'https://api.kidsdesigncompany.com/api/v1';

// Helper to handle API errors
const handleApiError = async (response: Response, customMessage: string) => {
  const errorText = await response.text();
  
  throw new Error(`${customMessage}. Status: ${response.status}. Message: ${errorText || 'No details provided'}`);
};

// Fetch products for the homepage
export async function fetchProducts(page: number, pageSize: number): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`${BASE_URL}/product/item/homepage/?page=${page}&page_size=${pageSize}`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    
    throw error;
  }
}

// Fetch product details by ID
export async function fetchProductDetails(productId: number): Promise<Product> {
  try {
    const response = await fetch(`${BASE_URL}/product/item/${productId}/`);
    if (!response.ok) {
      await handleApiError(response, `Failed to fetch product ${productId}`);
    }
    return await response.json();
  } catch (error) {
    
    throw error;
  }
}

// Fetch suggested product IDs
export async function fetchSuggestedProductIds(
  page: number,
  pageSize: number,
  subcategoryId?: number,
  secondSubcategoryId?: number
): Promise<ApiResponse<number>> {
  try {
    let url = `${BASE_URL}/product/item/suggestions/?page=${page}&page_size=${pageSize}`;
    if (subcategoryId) {
      url += `&sub_category_id=${subcategoryId}`;
    }
    if (secondSubcategoryId) {
      url += `&second_sub_category_id=${secondSubcategoryId}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch suggested product IDs');
    }
    return await response.json();
  } catch (error) {
    
    throw error;
  }
}

// Fetch suggested products with details
export async function fetchSuggestedProductsDetails(params: {
  page: string | number;
  page_size: string | number;
  subcategory_id?: number;
  second_subcategory_id?: number;
}): Promise<ApiResponse<Product>> {
  try {
    let url = `${BASE_URL}/product/item/suggestions/?page=${params.page}&page_size=${params.page_size}`;
    if (params.subcategory_id) {
      url += `&sub_category_id=${params.subcategory_id}`;
    }
    if (params.second_subcategory_id) {
      url += `&second_sub_category_id=${params.second_subcategory_id}`;
    }
    
    
    const response = await fetch(url);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch suggested products');
    }
    return await response.json();
  } catch (error) {
    
    throw error;
  }
}

// Check if a product is in the wishlist
export async function isProductInWishlist(productId: number): Promise<boolean> {
  try {
    const JWT_TOKEN = localStorage.getItem('accessToken');
    const response = await fetch(`${BASE_URL}/wishlist/check/${productId}/`, {
      headers: JWT_TOKEN ? { Authorization: `JWT ${JWT_TOKEN}` } : {},
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.isInWishlist || false;
  } catch (error) {
    
    return false;
  }
}

// Add item to wishlist
export async function addWishItem(productId: number): Promise<void> {
  try {
    const JWT_TOKEN = localStorage.getItem('accessToken');
    if (!JWT_TOKEN) {
      throw new Error('Authentication required to add wishlist item');
    }

    // Check if item is already in wishlist
    const isInWishlist = await isProductInWishlist(productId);
    if (isInWishlist) {
      return;
    }

    const response = await fetch(`${BASE_URL}/wishlist/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${JWT_TOKEN}`,
      },
      body: JSON.stringify({ product: productId }),
    });

    if (!response.ok) {
      await handleApiError(response, `Failed to add product ${productId} to wishlist`);
    }
  } catch (error) {
    
    throw error;
  }
}

// Sync local wishlist to database
import { WishData } from '@/pages/orders/api';

export async function syncLocalWishlistToDatabase(localWishlist: number[]): Promise<void> {
  try {
    const serverWishlistResponse = await WishData();
    const serverWishlistProductIds = serverWishlistResponse.results.map(item => item.product.id);

    for (const productId of localWishlist) {
      if (serverWishlistProductIds.includes(productId)) {
        continue;
      }
      try {
        await addWishItem(productId);
      } catch (error) {
        
      }
    }
    localStorage.removeItem('wishlist');
  } catch (error) {
    
    throw error;
  }
}

// Fetch slider items
export async function fetchSliderItems(): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`${BASE_URL}/product/item/?ordering=-latest_item&ordering=-top_selling_items&page_size=30`);
    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch slider items');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
