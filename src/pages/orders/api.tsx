import type { OrderData, WishItem } from './types';

// eslint-disable-next-line react-refresh/only-export-components
export const fetchData = async (): Promise<OrderData[]> => {
  try {
    const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/orders/item/?format=json');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const WishData = async (): Promise<WishItem[]> => {
    try {
      const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/wishlist/?format=json');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching wishlist data:', error);
      throw error;
    }
  };
