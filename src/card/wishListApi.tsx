import type { WishItem } from './types';

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

// Fetch wishlist items
export const WishData = async (): Promise<WishItem[]> => {
  return await fetcher<WishItem[]>('http://kidsdesignecommerce.pythonanywhere.com/api/v1/wishlist/?format=json');
};
