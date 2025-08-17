export interface LocalCartItem {
  productId: number;
  sizeId?: number;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  discountedPrice?: number | null;
  sizeUndiscountedPrice?: number | string | null;
  sizeName?: string;
  quantity?: number;
  maxQuantity?: number;
  subCategoryId?: number;
  subCategoryName?: string;
}

export const getLocalCart = (): LocalCartItem => {
  try {
    const cart = localStorage.getItem('guestCart');
    // 
    if (!cart) {
      // 
      return [];
    }

    const parsedCart = JSON.parse(cart);
    // 

    const filteredItems = Array.isArray(parsedCart)
      ? parsedCart
          .filter((item): item is LocalCartItem => {
            const isValid = item && typeof item === 'object' && 'productId' in item;
            if (!isValid) {
              // Remove console.warn
            }
            return isValid;
          })
          .map(item => ({
            ...item,
            productId: Number(item.productId),
            quantity: item.quantity ?? 1,
          }))
      : [];
    
    // 
    //   count: filteredItems.length,
    //   productIds: filteredItems.map(item => item.productId),
    // });
    return filteredItems;
  } catch (error) {
    // console.error('getLocalCart: Error reading local storage:', error);
    return [];
  }
};

export const addToLocalCart = (item: LocalCartItem) => {
  const cart = getLocalCart();
  const existingItemIndex = cart.findIndex(
    cartItem => cartItem.productId === item.productId && cartItem.sizeId === item.sizeId
  );

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity ?? 1) + (item.quantity ?? 1);
  } else {
    cart.push({
      ...item,
      productId: Number(item.productId),
      subCategoryId: item.subCategoryId || 0,
      subCategoryName: item.subCategoryName || 'Unknown',
      quantity: item.quantity ?? 1,
    });
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
      return false;
    }

    const data = await response.json();
    if (data.results && data.results.length > 0 && data.results[0].cart_items) {
      return data.results[0].cart_items.some(
        (item: any) => item.product.id === productId && item.size.id === sizeId
      );
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

const baseURL = "https://api.fluxdevs.com";

export const migrateLocalCartToUserCart = async (accessToken: string): Promise<boolean> => {
  try {
    const localCart = getLocalCart();
    if (localCart.length === 0) return true;

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

      if (!createResponse.ok) return false;
      const newCartData = await createResponse.json();
      cartUuid = newCartData.id;
    }

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

    clearLocalCart();
    return true;
  } catch (error) {
    return false;
  }
};