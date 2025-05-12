interface LocalCartItem {
  productId: number;
  sizeId: number;
  productName: string;
  productImage: string;
  productPrice: string;
  discountedPrice: string;
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
