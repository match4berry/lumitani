let cart = [];

const getCart = () => {
  return cart;
};

const addToCart = (product, quantity = 1) => {
  // product can be an object with details or just productId string/number
  const productData = typeof product === 'object' ? product : { id: product, productId: product };
  const productId = productData.id || productData.productId;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    // Store full product details
    cart.push({
      id: productId,
      ...productData,
      quantity
    });
  }
  
  return cart;
};

const removeFromCart = (productId) => {
  cart = cart.filter(item => item.id !== productId);
  return cart;
};

const clearCart = () => {
  cart = [];
  return cart;
};

const updateCartItem = (productId, quantity) => {
  const item = cart.find(item => item.id === productId);
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
