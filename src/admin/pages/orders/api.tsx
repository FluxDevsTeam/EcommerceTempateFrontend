export const fetchData = async () => {
  try {
    const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/orders/admin/?format=json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};