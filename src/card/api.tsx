import type { WishItem } from './types';

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0MDYwMjU4LCJpYXQiOjE3NDU0MjAyNTgsImp0aSI6IjliN2ZkYTA5NjM4YjQ1Y2NhY2MxN2MzNTg0YjY4NzBlIiwidXNlcl9pZCI6MX0.tAcgF3eEibG9JFTUx_BrN5g28W_jajvc10JO3z3uz0g';

// DELETE wish item by ID
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
      const errorText = await response.text();
      throw new Error(`Failed to delete wishlist item. Status: ${response.status}. Message: ${errorText}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting wishlist item with ID ${id}:`, error);
    throw error;
  }
};

// ADD new wish item (returns full WishItem with `id` and `product`)
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
      const errorText = await response.text();
      throw new Error(`Failed to add wishlist item. Status: ${response.status}. Message: ${errorText}`);
    }

    const data = await response.json();

    // Validate data has required properties
    if (!data.id || !data.product) {
      throw new Error('Invalid response format: missing `id` or `product`');
    }

    return data as WishItem;
  } catch (error) {
    console.error(`❌ Error adding wishlist item for product ID ${productId}:`, error);
    throw error;
  }
};
