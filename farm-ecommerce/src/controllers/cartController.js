let cart = [];

const getCart = () => {
  return cart;
};

const addToCart = (productId, quantity = 1) => {
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  
  return cart;
};

const removeFromCart = (productId) => {
  cart = cart.filter(item => item.productId !== productId);
  return cart;
};

const clearCart = () => {
  cart = [];
  return cart;
};

const updateCartItem = (productId, quantity) => {
  const item = cart.find(item => item.productId === productId);
  if (item) {
    item.quantity = quantity;
  }
  return cart;
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItem
};
