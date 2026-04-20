// Product Controller - API-driven
// Fetches products from catalog API

const fetchAllProducts = async () => {
  try {
    const endpoint = `${process.env.API_URL}/api/products/data`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return { items: [] };
  }
};

const fetchProductsByCommodity = async (commodityId) => {
  try {
    const endpoint = `${process.env.API_URL}/api/products/data?c_id=${commodityId}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching products for commodity ${commodityId}:`, error);
    return { items: [] };
  }
};

const fetchProductById = async (productId) => {
  try {
    const endpoint = `${process.env.API_URL}/api/products/data/${productId}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
};

const fetchCategories = async () => {
  try {
    const endpoint = `${process.env.API_URL}/api/commodities`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

module.exports = {
  fetchAllProducts,
  fetchProductsByCommodity,
  fetchProductById,
  fetchCategories
};
