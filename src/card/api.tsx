import type { WishItem } from './types';

const getToken = () => sessionStorage.getItem('jwt_token');

export const deleteWishItem = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${getToken()}`,
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
        'Authorization': `JWT ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product: productId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add wishlist item. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error adding wishlist item:`, error);
    throw error;
  }
};







// import type { WishItem } from './types';

// const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0MDYwMjU4LCJpYXQiOjE3NDU0MjAyNTgsImp0aSI6IjliN2ZkYTA5NjM4YjQ1Y2NhY2MxN2MzNTg0YjY4NzBlIiwidXNlcl9pZCI6MX0.tAcgF3eEibG9JFTUx_BrN5g28W_jajvc10JO3z3uz0g';


// export const deleteWishItem = async (id: number): Promise<void> => {
//   try {
//     const response = await fetch(`https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/${id}/`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `JWT ${JWT_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to delete wishlist item with ID ${id}. Status: ${response.status}`);
//     }
//   } catch (error) {
//     console.error(`Error deleting wishlist item ${id}:`, error);
//     throw error;
//   }
// };


// export const addWishItem = async (productId: number): Promise<WishItem> => {
//   try {
//     const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/', {
//       method: 'POST',
//       headers: {
//         'Authorization': `JWT ${JWT_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ product: productId }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to add wishlist item. Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data; // data includes product, id, and date
//   } catch (error) {
//     console.error(`Error adding wishlist item:`, error);
//     throw error;
//   }
// };