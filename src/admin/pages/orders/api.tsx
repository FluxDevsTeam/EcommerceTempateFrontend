const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU0MDYwMjU4LCJpYXQiOjE3NDU0MjAyNTgsImp0aSI6IjliN2ZkYTA5NjM4YjQ1Y2NhY2MxN2MzNTg0YjY4NzBlIiwidXNlcl9pZCI6MX0.tAcgF3eEibG9JFTUx_BrN5g28W_jajvc10JO3z3uz0g';

export const fetchData = async () => {
  try {
    const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/admin/order/?format=json', {
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
    console.error('Error fetching data:', error);
    throw error;
  }
};


export const PatchOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`https://ecommercetemplate.pythonanywhere.com/api/v1/admin/order/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `JWT ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('API Error:', responseData);
      throw new Error(`Failed to update order status: ${responseData.message || response.statusText}`);
    }

    console.log('Order updated successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error in patchOrderStatus:', error);
    throw new Error('Failed to update order status');
  }
};