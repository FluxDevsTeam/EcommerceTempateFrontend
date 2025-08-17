// wishListApi.tsx
import type { WishItem } from './types';

// Generic GET fetcher
const fetcher = async <T = unknown>(url: string): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `JWT ${localStorage.getItem('accessToken') || ''}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
};

// Fetch wishlist items with pagination
export const WishData = async (page: number = 1, pageSize: number = 16): Promise<{ count: number, next: string | null, previous: string | null, results: WishItem[] }> => {
  const url = `https://api.fluxdevs.com/api/v1/wishlist/?format=json&page=${page}&page_size=${pageSize}&ordering=-date`;
  const data = await fetcher<any>(url);
  
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return {
    count: data.count || data.results?.length || 0,
    next: data.next || null,
    previous: data.previous || null,
    results: data.results || [],
  };
};

// Fetch all wishlist items
export const fetchAllWishlistItems = async (): Promise<WishItem[]> => {
  let allItems: WishItem[] = [];
  let page = 1;
  const pageSize = 16;

  while (true) {
    const data = await WishData(page, pageSize);
    allItems = [...allItems, ...data.results];

    if (!data.next || data.results.length === 0) break;
    page++;
  }

  
  return allItems;
};