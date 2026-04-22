// Product Controller - API-driven
// Fetches products from catalog API

const fetchAllProducts = async () => {
  try {
    const endpoint = `${process.env.API_URL}/api/products/data`;
    console.log('[PRODUCTS] Fetching from:', endpoint);
    const res = await fetch(endpoint, { timeout: 5000 });
    if (!res.ok) {
      console.warn('[PRODUCTS] API returned status:', res.status);
      return { items: [] };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[PRODUCTS] Error fetching all products:', error.message);
    return { items: [] };
  }
};

const fetchProductsByCommodity = async (commodityId) => {
  try {
    const endpoint = `${process.env.API_URL}/api/products/data?c_id=${commodityId}`;
    console.log('[PRODUCTS] Fetching by commodity:', endpoint);
    const res = await fetch(endpoint, { timeout: 5000 });
    if (!res.ok) {
      console.warn('[PRODUCTS] API returned status:', res.status);
      return { items: [] };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[PRODUCTS] Error fetching products for commodity ${commodityId}:`, error.message);
    return { items: [] };
  }
};

const fetchProductById = async (productId) => {
  try {
    const endpoint = `${process.env.API_URL}/api/products/data/${productId}`;
    const res = await fetch(endpoint, { timeout: 5000 });
    if (!res.ok) {
      console.warn('[PRODUCTS] API returned status:', res.status);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[PRODUCTS] Error fetching product ${productId}:`, error.message);
    return null;
  }
};

const fetchCategories = async () => {
  try {
    const endpoint = `${process.env.API_URL}/api/commodities`;
    console.log('[CATEGORIES] Fetching from:', endpoint);
    const res = await fetch(endpoint, { timeout: 5000 });
    if (!res.ok) {
      console.warn('[CATEGORIES] API returned status:', res.status);
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[CATEGORIES] Error fetching categories:', error.message);
    return [];
  }
};

module.exports = {
  fetchAllProducts,
  fetchProductsByCommodity,
  fetchProductById,
  fetchCategories
};
