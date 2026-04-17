const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { getProducts, getProductById, fetchProductById, fetchProducts, fetchCategories } = require('./controllers/productController');
const { getCart, addToCart, removeFromCart } = require('./controllers/cartController');
const orderRoutes = require('./routes/order');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine with layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.set('layout', 'layout');

// Routes

// Home page
app.get('/', async (req, res) => {
  let products = []
  try {
    var callProducts
    if(req.query.category){
      callProducts  = fetchProducts(req.query.category)
    }else{
      callProducts = fetchProducts()
    }
    const mappingFuncCall = [callProducts, fetchCategories()]
    let [dataProducts, dataCategories] = await Promise.all(mappingFuncCall)
    products = dataProducts.items
    categories = Array.isArray(dataCategories) ? dataCategories : (dataCategories.items || [])
  }catch(err) {
    console.log(err)
  }
  res.render('landing', { products, categories, currentCategory: 'all' });
});

// Catalog with category filter
app.get('/catalog', (req, res) => {
  const category = req.query.category || 'all';
  let products = getProducts();
  
  if (category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  
  const categories = ['sayuran', 'padi-padian', 'umbi-umbian', 'buah-buahan', 'bumbu-dapur'];
  res.render('catalog', { products, categories, currentCategory: category });
});

// Product detail page
app.get('/product/:id', (req, res) => {
  const product = getProductById(parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).render('404');
  }
  
  res.render('product-detail', { product });
});

// Cart page
app.get('/cart', (req, res) => {
  const cart = getCart();
  res.render('cart', { cart });
});

// Add to cart API
app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  addToCart(productId, quantity);
  res.json({ success: true });
});

// Remove from cart API
app.post('/api/cart/remove', (req, res) => {
  const { productId } = req.body;
  removeFromCart(productId);
  res.json({ success: true });
});

// About page
app.get('/about', (req, res) => {
  res.render('about');
});

// Profile page
app.get('/profile', (req, res) => {
  res.render('profile');
});

// Alamat Pengiriman (Shipping Address) page
app.get('/alamat-pengiriman', (req, res) => {
  res.render('alamat-pengiriman');
});

// Pesanan Saya (My Orders) page - renamed to order-history
app.get('/order-history', (req, res) => {
  try {
    const fs = require('fs');
    const ordersPath = path.join(__dirname, '../data/orders.json');
    
    // Read orders from file
    const ordersData = fs.readFileSync(ordersPath, 'utf8');
    let allOrders = JSON.parse(ordersData);
    
    // Filter by status if provided
    const { status, sort, page = 1 } = req.query;
    let filteredOrders = allOrders;
    
    if (status && status !== 'all') {
      const statusMap = {
        'pending': 'Menunggu Diproses',
        'processing': 'Diproses',
        'completed': 'Selesai',
        'shipped': 'Pengiriman'
      };
      const statusValue = statusMap[status];
      filteredOrders = allOrders.filter(order => order.status === statusValue);
    }
    
    // Sort orders
    if (sort === 'oldest') {
      filteredOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Pagination
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentPage = Math.min(Math.max(parseInt(page) || 1, 1), totalPages || 1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const orders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    
    // Map display seller names from items or use default
    orders.forEach(order => {
      order.seller = order.seller || 'Penjual Lokal Manud Jaya';
    });
    
    res.render('order-history', { 
      orders, 
      currentPage, 
      totalPages,
      currentStatus: status || 'all',
      currentSort: sort || 'newest'
    });
  } catch (err) {
    console.error('Error loading orders:', err);
    const { status, sort } = req.query;
    res.render('order-history', { 
      orders: [], 
      currentPage: 1, 
      totalPages: 0,
      currentStatus: status || 'all',
      currentSort: sort || 'newest'
    });
  }
});

// Redirect from old pesanan-saya route
app.get('/pesanan-saya', (req, res) => {
  res.redirect('/order-history');
});

// Order routes
app.use(orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Farm E-commerce app running on http://localhost:${PORT}`);
});
