import type { WishItem } from './types';

const BASE_URL = 'https://ecommercetemplate.pythonanywhere.com/api/v1/orders/item/';
const WISHLIST_LOCAL_STORAGE_KEY = 'wishlistItems';

// Helper function to get wishlist from local storage
export const getWishlistFromLocalStorage = (): WishItem[] => {
  const storedWishlist = localStorage.getItem(WISHLIST_LOCAL_STORAGE_KEY);
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

// Helper function to save wishlist to local storage
const saveWishlistToLocalStorage = (wishlist: WishItem[]) => {
  localStorage.setItem(WISHLIST_LOCAL_STORAGE_KEY, JSON.stringify(wishlist));
};

// Helper function to add item to local storage wishlist
const addToWishlistLocalStorage = (product: any): WishItem => { // Assuming product has an id
  const currentWishlist = getWishlistFromLocalStorage();
  // Create a new wishlistItem. Adjust structure as needed, especially if product details are not directly available.
  // This is a simplified version. You might need to fetch full product details or adjust what's stored.
  const newWishlistItem: WishItem = {
    id: Date.now(), // Temporary ID for local storage item
    product: {
        id: product.id,
        name: product.name,
        image1: product.image1, // Ensure these fields are available
        price: product.price,
        undiscounted_price: product.undiscounted_price,
    },
    date: new Date().toISOString(),
  };
  const updatedWishlist = [...currentWishlist, newWishlistItem];
  saveWishlistToLocalStorage(updatedWishlist);
  return newWishlistItem;
};

// Helper function to remove item from local storage wishlist
const removeFromWishlistLocalStorage = (productId: number): void => {
  const currentWishlist = getWishlistFromLocalStorage();
  const updatedWishlist = currentWishlist.filter(item => item.product.id !== productId);
  saveWishlistToLocalStorage(updatedWishlist);
};

// Helper function to clear local storage wishlist
export const clearWishlistLocalStorage = (): void => {
  localStorage.removeItem(WISHLIST_LOCAL_STORAGE_KEY);
};


export const fetchData = async (url = `${BASE_URL}?page=1`) => {
  try {
    const JWT_TOKEN = localStorage.getItem('accessToken');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${JWT_TOKEN}`, // make sure JWT_TOKEN is defined
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results ?? data;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
};

// Fetch orders
// export const fetchData = async (url?: string): Promise<OrderData[]> => {
//   const endpoint = url ?? 'https://ecommercetemplate.pythonanywhere.com/api/v1/orders/item/?format=json';

//   try {
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: {
//         'Authorization': `JWT ${JWT_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch orders. Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(`Error fetching orders from ${endpoint}:`, error);
//     throw error;
//   }
// };

// Fetch wishlist items
export const WishData = async (): Promise<WishItem[]> => {
  const JWT_TOKEN = localStorage.getItem('accessToken');
  if (JWT_TOKEN) {
    return await fetcher<WishItem[]>('https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/?format=json');
  } else {
    return getWishlistFromLocalStorage();
  }
};

// DELETE wishlist item by ID
export const deleteWishItem = async (id: number, productId?: number): Promise<void> => { // productId for local storage
  const JWT_TOKEN = localStorage.getItem('accessToken');
  if (JWT_TOKEN) {
    try {
      const response = await fetch(`https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `JWT ${JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete wishlist item with ID ${id}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting wishlist item ${id}:`, error);
      throw error;
    }
  } else {
    if (productId === undefined) {
        console.warn("productId is undefined, cannot remove from local storage wishlist by product ID");
        return;
    }
    removeFromWishlistLocalStorage(productId);
  }
};


export const addWishItem = async (product: any): Promise<WishItem> => { // product can be productId (number) or product object
  const JWT_TOKEN = localStorage.getItem('accessToken');
  if (JWT_TOKEN) {
    try {
      const productId = typeof product === 'number' ? product : product.id;
      const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/', {
        method: 'POST',
        headers: {
          'Authorization': `JWT ${JWT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: productId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add wishlist item. Status: ${response.status}`);
      }

      const data = await response.json();
      return data; // data includes product, id, and date
    } catch (error) {
      console.error(`Error adding wishlist item:`, error);
      throw error;
    }
  } else {
    // For unauthenticated users, product should be the full product object to store its details
    if (typeof product === 'number' || !product.id || !product.name) {
        // If only productId is passed, or product object is incomplete, this won't work well for local storage
        // Ideally, the component calling this should pass the full product object if user is not logged in
        console.error("Full product object needed for adding to local wishlist for unauthenticated user.");
        // Fallback or error handling: create a minimal item or throw error
        // This example creates a minimal item, which might not be ideal for display
        return addToWishlistLocalStorage({ id: product, name: "Unknown Product", image1: "", price: 0, undiscounted_price: 0 });
    }
    return addToWishlistLocalStorage(product);
  }
};








// import type { OrderData, WishItem } from './types';

// // eslint-disable-next-line react-refresh/only-export-components
// export const fetchData = async (): Promise<OrderData[]> => {
//   try {
//     const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/orders/item/?format=json');
//     const data = await response.json();
//     return data.results;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };

// export const WishData = async (): Promise<WishItem[]> => {
//     try {
//       const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/?format=json');
//       const data = await response.json();
//       return data.results;
//     } catch (error) {
//       console.error('Error fetching wishlist data:', error);
//       throw error;
//     }
//   };