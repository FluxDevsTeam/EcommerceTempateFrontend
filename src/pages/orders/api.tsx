// api.tsx
import type { WishItem } from './types';

const BASE_URL = 'https://api.kidsdesigncompany.com/api/v1';
const WISHLIST_LOCAL_STORAGE_KEY = 'wishlistItems';
const CART_LOCAL_STORAGE_KEY = 'cart';

// Cart item interface
interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    image1: string;
  };
  size: {
    id: number;
    size: string;
    quantity: number;
    undiscounted_price: string;
    price: string;
  };
  quantity: number;
}

// Local cart item interface
interface LocalCartItem {
  id: number;
  productId: number;
  quantity?: number;
  sizeId?: number;
}

// Helper function to get wishlist from local storage
export const getWishlistFromLocalStorage = (): WishItem[] => {
  try {
    const storedWishlist = localStorage.getItem(WISHLIST_LOCAL_STORAGE_KEY);
    const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    // NEW: Validate wishlist items
    return Array.isArray(wishlist) ? wishlist.filter(item => item?.product?.id) : [];
  } catch (error) {
    console.error('getWishlistFromLocalStorage: Error reading local storage:', error);
    return [];
  }
};

// Helper function to get cart from local storage
export const getLocalCart = (): LocalCartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_LOCAL_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('getLocalCart: Error reading local storage:', error);
    return [];
  }
};

// Helper function to save wishlist to local storage
const saveWishlistToLocalStorage = (wishlist: WishItem[]) => {
  try {
    localStorage.setItem(WISHLIST_LOCAL_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (error) {
    console.error('saveWishlistToLocalStorage: Error saving to local storage:', error);
  }
};

// Helper function to add item to local storage wishlist
export const addToWishlistLocalStorage = (product: any): WishItem => {
  const currentWishlist = getWishlistFromLocalStorage();
  const productId = typeof product === 'number' ? product : product.id;
  const existingItem = currentWishlist.find(item => item.product.id === productId);
  if (existingItem) {
    
    return existingItem;
  }
  const newWishlistItem: WishItem = {
    id: Date.now(),
    product: {
      id: productId,
      name: product.name || 'Unknown Product',
      image1: product.image1 || '',
      price: Number(product.price) || 0,
      undiscounted_price: Number(product.undiscounted_price) || 0,
      // NEW: Add default sub_category for guest users
      sub_category: product.sub_category || { id: 0, name: 'Unknown' },
    },
    date: new Date().toISOString(),
  };
  const updatedWishlist = [...currentWishlist, newWishlistItem];
  saveWishlistToLocalStorage(updatedWishlist);
  
  return newWishlistItem;
};

// Helper function to remove item from local storage wishlist
export const removeFromWishlistLocalStorage = (productId: number): void => {
  const currentWishlist = getWishlistFromLocalStorage();
  const updatedWishlist = currentWishlist.filter(item => item.product.id !== productId);
  saveWishlistToLocalStorage(updatedWishlist);
  
};

// Helper function to clear local storage wishlist
export const clearWishlistLocalStorage = (): void => {
  localStorage.removeItem(WISHLIST_LOCAL_STORAGE_KEY);
  
};

export const fetchData = async (url = `${BASE_URL}/orders/item/?page=1`) => {
  try {
    const JWT_TOKEN = localStorage.getItem('accessToken');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `JWT ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchData: Error fetching data:', error);
    throw error;
  }
};

// Generic GET fetcher
const fetcher = async <T = unknown>(url: string): Promise<T> => {
  try {
    const JWT_TOKEN = localStorage.getItem('accessToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (JWT_TOKEN) {
      headers['Authorization'] = `JWT ${JWT_TOKEN}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetcher: Error fetching data:', error);
    return [] as T;
  }
};

export const WishData = async (
  page: number = 1,
  pageSize: number = 99
): Promise<{
  count: number;
  next: null;
  previous: null;
  results: WishItem[];
}> => {
  const JWT_TOKEN = localStorage.getItem('accessToken');

  if (!JWT_TOKEN) {
    try {
      const localStorageItems = getWishlistFromLocalStorage();
      const result = {
        count: localStorageItems.length,
        next: null,
        previous: null,
        results: localStorageItems,
      };
      
      return result;
    } catch (error) {
      console.error('WishData: Error reading local wishlist:', error);
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    }
  }

  try {
    const allResults: WishItem[] = [];
    let url: string | null = `${BASE_URL}/wishlist/?ordering=-date&page_size=${pageSize}`;
    let totalCount = 0;
    const fetchedUrls = new Set<string>();

    while (url) {
      if (fetchedUrls.has(url)) {
        console.warn('WishData: Duplicate URL detected, stopping loop:', url);
        break;
      }
      fetchedUrls.add(url);
      const data = await fetcher(url);

      if (!data || !Array.isArray(data.results) || typeof data.count !== 'number') {
        throw new Error('Invalid API response: missing results or count');
      }

      totalCount = data.count;
      allResults.push(...data.results);
      url = data.next;
    }

    // Deduplicate by id
    const dedupedResults = Array.from(
      new Map(allResults.map(item => [item.id, item])).values()
    );

    if (dedupedResults.length !== totalCount) {
      console.warn(
        `WishData: After deduplication, have ${dedupedResults.length} items, expected ${totalCount}.`
      );
    }

    const result = {
      count: totalCount,
      next: null,
      previous: null,
      results: dedupedResults,
    };
    

    return result;
  } catch (error) {
    console.error('WishData: Failed to fetch wishlist:', error);
    throw error;
  }
};

// Fetch wishlist items
export const WishlistData = async (
  page: number = 1,
  pageSize: number = 16
): Promise<{
  count: number;
  next: string | null;
  previous: string | null;
  results: WishItem[];
}> => {
  const JWT_TOKEN = localStorage.getItem('accessToken');
  if (JWT_TOKEN) {
    try {
      const url = `${BASE_URL}/wishlist/?format=json&order=-updated_at&page=${page}&page_size=${pageSize}&ordering=-date`;
      const data = await fetcher(url);
      
      // Handle 404 gracefully
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return { count: 0, next: null, previous: null, results: [] };
      }

      // Handle array response
      if (Array.isArray(data)) {
        return { count: data.length, next: null, previous: null, results: data };
      }

      // Handle paginated response
      return {
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
        results: data.results || [],
      };
    } catch (error) {
      // On error, return empty result instead of throwing
      console.error('WishlistData: Error fetching:', error);
      return { count: 0, next: null, previous: null, results: [] };
    }
  } else {
    const localStorageItems = getWishlistFromLocalStorage();
    const totalItems = localStorageItems.length;
    
    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = localStorageItems.slice(startIndex, endIndex);

    // Simulate next/previous URLs (optional, can be null if not needed)
    const next = endIndex < totalItems ? `page=${page + 1}` : null;
    const previous = page > 1 ? `page=${page - 1}` : null;

    return {
      count: totalItems,
      next,
      previous,
      results: paginatedItems,
    };
  }
};

// DELETE wishlist item
export const deleteWishItem = async (
  id: number,
  productId?: number
): Promise<void> => {
  const JWT_TOKEN = localStorage.getItem('accessToken');
  if (JWT_TOKEN) {
    // Check if item exists in local storage (from 500 error fallback)
    const localWishlist = getWishlistFromLocalStorage();
    const localItem = localWishlist.find(item => item.product.id === productId);
    if (localItem && localItem.id === id) {
      
      removeFromWishlistLocalStorage(productId!);
      // NEW: Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { productId } }));
      return;
    }

    // Attempt server deletion
    try {
      
      const response = await fetch(
        `${BASE_URL}/wishlist/${id}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `JWT ${JWT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('deleteWishItem: Server error response:', { status: response.status, errorData });
        throw new Error(
          `Failed to delete wishlist item with ID ${id}. Status: ${response.status}`
        );
      }
      
      // NEW: Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { 
          productId,
          action: 'remove'
        }
      }));
    } catch (error) {
      console.error('deleteWishItem: Error deleting wishlist item:', error, { id, productId });
      throw error;
    }
  } else {
    if (productId === undefined) {
      console.error('deleteWishItem: No productId provided for local storage deletion');
      throw new Error('Product ID required for guest wishlist removal');
    }
    
    removeFromWishlistLocalStorage(productId);
    // NEW: Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { productId } }));
  }
};

// New function to sync local wishlist with API
export const syncWishlistWithApi = async (): Promise<void> => {
  const JWT_TOKEN = localStorage.getItem('accessToken');
  if (!JWT_TOKEN) return;

  try {
    // Get local wishlist items
    const localWishlist = getWishlistFromLocalStorage();
    if (localWishlist.length === 0) return;

    // Get current API wishlist
    const apiWishlist = await WishData();
    const existingProductIds = new Set(apiWishlist.results.map(item => item.product.id));

    // Filter out items that already exist in API wishlist
    const itemsToSync = localWishlist.filter(item => !existingProductIds.has(item.product.id));

    // Add new items to API wishlist
    for (const item of itemsToSync) {
      await addWishItem(item.product);
    }

    // Clear local storage wishlist after successful sync
    clearWishlistLocalStorage();
  } catch (error) {
    console.error('syncWishlistWithApi: Error syncing wishlist:', error);
  }
};

// Add to wishlist
export const addWishItem = async (product: any): Promise<WishItem> => {
  const JWT_TOKEN = localStorage.getItem('accessToken');

  if (JWT_TOKEN) {
    try {
      const productId = typeof product === 'number' ? product : product.id;
      
      // Check if item already exists in API wishlist
      const currentWishlist = await WishData();
      const existingItem = currentWishlist.results.find(item => item.product.id === productId);
      if (existingItem) {
        return existingItem;
      }

      const response = await fetch(
        `${BASE_URL}/wishlist/`,
        {
          method: 'POST',
          headers: {
            Authorization: `JWT ${JWT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product: productId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }

      const data = await response.json();
      
      // Format the response data
      const formattedItem: WishItem = {
        id: data.id,
        product: {
          id: product.id,
          name: product.name,
          image1: product.image1,
          price: Number(product.price),
          undiscounted_price: Number(product.undiscounted_price),
          sub_category: product.sub_category
        }
      };

      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { 
          productId,
          action: 'add',
          newItem: formattedItem
        }
      }));
      return formattedItem;
    } catch (error) {
      console.error('addWishItem: Error:', error);
      return addToWishlistLocalStorage(product);
    }
  } else {
    if (typeof product === 'number' || !product?.id || !product?.name) {
      
      return addToWishlistLocalStorage({
        id: typeof product === 'number' ? product : product?.id || 0,
        name: 'Unknown Product',
        image1: '',
        price: 0,
        undiscounted_price: 0,
        sub_category: { id: 0, name: 'Unknown' }, // NEW: Default sub_category
      });
    }
    
    const newItem = addToWishlistLocalStorage(product);
    // NEW: Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { productId: product.id } }));
    return newItem;
  }
};

// Fetch cart items
export const fetchCartItems = async (): Promise<{
  count: number;
  next: string | null;
  previous: string | null;
  results: CartItem[];
}> => {
  const JWT_TOKEN = localStorage.getItem('accessToken');
  if (JWT_TOKEN) {
    let allItems: CartItem[] = [];
    let url: string | null = `${BASE_URL}/cart/?format=json`;
    try {
      while (url) {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `JWT ${JWT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('fetchCartItems: Server error:', { status: response.status, errorData });
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        if (data.results[0]?.cart_items) {
          allItems = [...allItems, ...data.results[0].cart_items];
        }
        url = data.next;
      }
      
      return {
        count: allItems.length,
        next: null,
        previous: null,
        results: allItems,
      };
    } catch (error) {
      console.error('fetchCartItems: Error fetching cart items:', error);
      return { count: 0, next: null, previous: null, results: [] };
    }
  } else {
    const localCart = getLocalCart();
    
    return {
      count: localCart.length,
      next: null,
      previous: null,
      results: localCart.map(item => ({
        id: item.id,
        product: {
          id: item.productId,
          name: 'Unknown Product',
          image1: '',
        },
        size: {
          id: item.sizeId || 0,
          size: 'Unknown',
          quantity: item.quantity || 1,
          undiscounted_price: '0',
          price: '0',
        },
        quantity: item.quantity || 1,
      })),
    };
  }
};