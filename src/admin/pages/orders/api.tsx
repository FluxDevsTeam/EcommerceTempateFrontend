//localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0MDYwMjU4LCJpYXQiOjE3NDU0MjAyNTgsImp0aSI6IjliN2ZkYTA5NjM4YjQ1Y2NhY2MxN2MzNTg0YjY4NzBlIiwidXNlcl9pZCI6MX0.tAcgF3eEibG9JFTUx_BrN5g28W_jajvc10JO3z3uz0g');
const JWT_TOKEN = localStorage.getItem('accessToken')
const BASE_URL = 'http://kidsdesignecommerce.pythonanywhere.com/api/v1/admin/order/';

export const fetchData = async (url = `${BASE_URL}`) => {
  try {
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


export const PatchOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`http://kidsdesignecommerce.pythonanywhere.com/api/v1/admin/order/${orderId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `JWT ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus.toUpperCase() })
    });

    const text = await response.text(); // handle both JSON and HTML
    console.log("Raw backend response:", text);

    if (!response.ok) {
      throw new Error(`Failed to update order status: ${text}`);
    }

    try {
      return JSON.parse(text); // Try parsing if it's actually JSON
    } catch {
      return text; // Fallback
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in patchOrderStatus:', error);
      throw new Error(`Failed to update order status: ${error.message}`);
    } else {
      console.error('Unknown error in patchOrderStatus:', error);
      throw new Error('Failed to update order status: Unknown error');
    }
  }
};