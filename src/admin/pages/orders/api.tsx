const JWT_TOKEN = localStorage.getItem('accessToken')
const BASE_URL = 'https://api.kidsdesigncompany.com/api/v1/admin/order/';

export const fetchData = async (url = `${BASE_URL}`) => {
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
    
    return data;
  } catch (error) {
    throw error;
  }
};


export const PatchOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`https://api.kidsdesigncompany.com/api/v1/admin/order/${orderId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `JWT ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus.toUpperCase() })
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to update order status: ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    } else {
      throw new Error('Failed to update order status: Unknown error');
    }
  }
};