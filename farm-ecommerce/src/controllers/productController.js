const e = require("express");


const products = [
  // Sayuran
  { id: 1, name: 'Tomat Segar', category: 'sayuran', price: 15000, image: '/images/tomat.jpg', description: 'Tomat segar berkualitas premium langsung dari petani', stock: 50 },
  { id: 2, name: 'Bayam Organik', category: 'sayuran', price: 12000, image: '/images/bayam.jpg', description: 'Bayam organik tanpa pestisida', stock: 30 },
  { id: 3, name: 'Brokoli Hijau', category: 'sayuran', price: 18000, image: '/images/brokoli.jpg', description: 'Brokoli segar dengan warna hijau alami', stock: 25 },
  { id: 4, name: 'Wortel Manis', category: 'sayuran', price: 14000, image: '/images/wortel.jpg', description: 'Wortel manis dan renyah', stock: 40 },
  
  // Padi-padian
  { id: 5, name: 'Beras Putih Premium', category: 'padi-padian', price: 45000, image: '/images/beras.jpg', description: 'Beras putih berkualitas premium per 5kg', stock: 100 },
  { id: 6, name: 'Gandum Utuh', category: 'padi-padian', price: 35000, image: '/images/gandum.jpg', description: 'Gandum utuh untuk tepung', stock: 50 },
  { id: 7, name: 'Jagung Pipil Segar', category: 'padi-padian', price: 25000, image: '/images/jagung.jpg', description: 'Jagung pipil hasil panen segar', stock: 60 },
  
  // Umbi-umbian
  { id: 8, name: 'Ubi Ungu', category: 'umbi-umbian', price: 20000, image: '/images/ubi-ungu.jpg', description: 'Ubi ungu kaya antioksidan per kg', stock: 40 },
  { id: 9, name: 'Kentang Putih', category: 'umbi-umbian', price: 22000, image: '/images/kentang.jpg', description: 'Kentang putih berkualitas tinggi per kg', stock: 50 },
  { id: 10, name: 'Singkong Segar', category: 'umbi-umbian', price: 12000, image: '/images/singkong.jpg', description: 'Singkong segar untuk berbagai masakan per kg', stock: 70 },
  
  // Buah-buahan
  { id: 11, name: 'Mangga Harum Manis', category: 'buah-buahan', price: 35000, image: '/images/mangga.jpg', description: 'Mangga harum manis hasil panen terbaik per kg', stock: 45 },
  { id: 12, name: 'Pisang Emas', category: 'buah-buahan', price: 18000, image: '/images/pisang.jpg', description: 'Pisang emas manis per tandan', stock: 60 },
  { id: 13, name: 'Nanas Segar', category: 'buah-buahan', price: 22000, image: '/images/nanas.jpg', description: 'Nanas segar manis per buah', stock: 35 },
  { id: 14, name: 'Papaya Merah', category: 'buah-buahan', price: 16000, image: '/images/papaya.jpg', description: 'Papaya merah matang per kg', stock: 40 },
  
  // Bumbu-dapur
  { id: 15, name: 'Cabai Merah Segar', category: 'bumbu-dapur', price: 28000, image: '/images/cabai-merah.jpg', description: 'Cabai merah segar pedas per kg', stock: 30 },
  { id: 16, name: 'Bawang Putih', category: 'bumbu-dapur', price: 32000, image: '/images/bawang-putih.jpg', description: 'Bawang putih berkualitas premium per kg', stock: 25 },
  { id: 17, name: 'Bawang Merah', category: 'bumbu-dapur', price: 30000, image: '/images/bawang-merah.jpg', description: 'Bawang merah segar per kg', stock: 35 },
  { id: 18, name: 'Kunyit Segar', category: 'bumbu-dapur', price: 18000, image: '/images/kunyit.jpg', description: 'Kunyit segar untuk jamu per 500g', stock: 40 }
];

const getProducts = () => {
  return products;
};

const fetchProducts = async (categoryId) => {
  try {
    
    let endpoint = `${process.env.API_URL}/api/products`
    if(categoryId){
      endpoint = `${endpoint}?c_id=${categoryId}`
    }
    let res = await fetch(endpoint);
    let data = await res.json()
    return data
  }catch (e) {
    return e
  }
}

const fetchProductById = async (id) => {
  let data = []
  try { 
    const endpoint = `${process.env.API_URL}/api/products/${id}`
    let res = await fetch(endpoint)
    data = await res.json()
    return data
  } catch (error) {
    return e    
  }
}

const fetchCategories = async () => {
  let data = []
  try {
    const endpoint = `${process.env.API_URL}/api/commodities`
    let res = await fetch(endpoint)
    data = await res.json()
    return data
  } catch (error) {
    return error    
  }
}

const getProductById = (id) => {
  return products.find(p => p.id === id);
};

const getProductsByCategory = (category) => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  fetchProducts,
  fetchProductById,
  fetchCategories
};
