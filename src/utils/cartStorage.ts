interface LocalCartItem {
  productId: number;
  sizeId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  discountedPrice?: number | null; // Product-level general discount, might not be size-specific
  sizeUndiscountedPrice?: number | string | null; // Size-specific original price, before any discount
  sizeName: string;
  quantity: number;
  maxQuantity: number;
}

export const getLocalCart = (): LocalCartItem[] => {
  const cart = localStorage.getItem('guestCart');
  return cart ? JSON.parse(cart) : [];
};

export const addToLocalCart = (item: LocalCartItem) => {
  const cart = getLocalCart();
  const existingItemIndex = cart.findIndex(
    cartItem => cartItem.productId === item.productId && cartItem.sizeId === item.sizeId
  );

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('guestCart', JSON.stringify(cart));
};

export const updateLocalCartItemQuantity = (productId: number, sizeId: number, quantity: number) => {
  const cart = getLocalCart();
  const updatedCart = cart.map(item => {
    if (item.productId === productId && item.sizeId === sizeId) {
      return { ...item, quantity };
    }
    return item;
  });
  localStorage.setItem('guestCart', JSON.stringify(updatedCart));
};

export const removeLocalCartItem = (productId: number, sizeId: number) => {
  const cart = getLocalCart();
  const updatedCart = cart.filter(item => 
    !(item.productId === productId && item.sizeId === sizeId)
  );
  localStorage.setItem('guestCart', JSON.stringify(updatedCart));
};

export const clearLocalCart = () => {
  localStorage.removeItem('guestCart');
};

export const isItemInLocalCart = (productId: number, sizeId: number): boolean => {
  const cart = getLocalCart();
  return cart.some(item => item.productId === productId && item.sizeId === sizeId);
};

export const isItemInUserCart = async (productId: number, sizeId: number): Promise<boolean> => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return isItemInLocalCart(productId, sizeId);
  }

  try {
    const response = await fetch(`${baseURL}/api/v1/cart/`, {
      method: "GET",
      headers: {
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch cart data:', response.status);
      return false;
    }

    const data = await response.json();
    
    // Check if there's a cart and it has items
    if (data.results && data.results.length > 0 && data.results[0].cart_items) {
      // Check if any cart item matches the product and size
      return data.results[0].cart_items.some(
        (item: any) => item.product.id === productId && item.size.id === sizeId
      );
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if item is in cart:', error);
    return false;
  }
};

const baseURL = "http://kidsdesignecommerce.pythonanywhere.com";

export const migrateLocalCartToUserCart = async (accessToken: string): Promise<boolean> => {
  try {
    const localCart = getLocalCart();
    if (localCart.length === 0) return true;

    // First get or create user cart
    let cartUuid;
    const cartResponse = await fetch(`${baseURL}/api/v1/cart/`, {
      method: "GET",
      headers: {
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (cartResponse.ok) {
      const cartData = await cartResponse.json();
      cartUuid = cartData.results[0]?.id;
    }

    // If no cart exists, create one
    if (!cartUuid) {
      const createResponse = await fetch(`${baseURL}/api/v1/cart/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: "",
          last_name: "",
          email: "",
          state: "",
          city: "",
          delivery_address: "",
          phone_number: "",
        }),
      });

      if (!createResponse.ok) throw new Error("Failed to create cart");
      const newCartData = await createResponse.json();
      cartUuid = newCartData.id;
    }

    // Add each local cart item to user's cart
    for (const item of localCart) {
      await fetch(`${baseURL}/api/v1/cart/${cartUuid}/items/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: item.productId,
          size: item.sizeId,
          quantity: item.quantity,
        }),
      });
    }

    // Clear local cart after successful migration
    clearLocalCart();
    return true;
  } catch (error) {
    console.error("Error migrating cart:", error);
    return false;
  }
};
