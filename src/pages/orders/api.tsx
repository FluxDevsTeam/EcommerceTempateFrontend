import type { OrderData, WishItem } from './types';

//localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0MDYwMjU4LCJpYXQiOjE3NDU0MjAyNTgsImp0aSI6IjliN2ZkYTA5NjM4YjQ1Y2NhY2MxN2MzNTg0YjY4NzBlIiwidXNlcl9pZCI6MX0.tAcgF3eEibG9JFTUx_BrN5g28W_jajvc10JO3z3uz0g');
const JWT_TOKEN = localStorage.getItem('accessToken')
// Generic GET fetcher
const fetcher = async <T = unknown>(url: string): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
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
export const fetchData = async (): Promise<OrderData[]> => {
  return await fetcher<OrderData[]>('https://ecommercetemplate.pythonanywhere.com/api/v1/orders/item/?format=json');
};

// Fetch wishlist items
export const WishData = async (): Promise<WishItem[]> => {
  return await fetcher<WishItem[]>('https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/?format=json');
};

// DELETE wishlist item by ID
export const deleteWishItem = async (id: number): Promise<void> => {
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
};


export const addWishItem = async (productId: number): Promise<WishItem> => {
  try {
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