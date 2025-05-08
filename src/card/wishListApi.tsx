import type { WishItem } from './types';

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0MDYwMjU4LCJpYXQiOjE3NDU0MjAyNTgsImp0aSI6IjliN2ZkYTA5NjM4YjQ1Y2NhY2MxN2MzNTg0YjY4NzBlIiwidXNlcl9pZCI6MX0.tAcgF3eEibG9JFTUx_BrN5g28W_jajvc10JO3z3uz0g';

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

// Fetch wishlist items
export const WishData = async (): Promise<WishItem[]> => {
  return await fetcher<WishItem[]>('https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/?format=json');
};
