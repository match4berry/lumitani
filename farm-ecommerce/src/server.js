const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const { fetchAllProducts, fetchProductsByCommodity, fetchProductById, fetchCategories } = require('./controllers/productController');
const { getCart, addToCart, removeFromCart } = require('./controllers/cartController');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'lumitani-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 60 * 24 } // 24 hours
}));

// Set view engine with layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.set('layout', 'layout');

// Routes

// Home page (before login) - shows landing-before-login + landing combined without bottom nav
app.get('/', async (req, res) => {
  let products = []
  try {
    var callProducts
    if(req.query.category){
      callProducts  = fetchProductsByCommodity(req.query.category)
    }else{
      callProducts = fetchAllProducts()
    }
    const mappingFuncCall = [callProducts, fetchCategories()]
    let [dataProducts, dataCategories] = await Promise.all(mappingFuncCall)
    products = dataProducts.items
    categories = Array.isArray(dataCategories) ? dataCategories : (dataCategories.items || [])
  }catch(err) {
    console.log(err)
  }

  // If not logged in, show combined landing-before-login + landing 
  if (!req.session.userId) {
    return res.render('landing-before-login', { 
      layout: false, 
      products, 
      categories, 
      currentCategory: 'all',
      isLoggedIn: false
    });
  }

  // If logged in, redirect to /home
  res.redirect('/home');
});

// Home page (after login) - shows landing page with bottom nav and layout
app.get('/home', async (req, res) => {
  // If not logged in, redirect to /
  if (!req.session.userId) {
    return res.redirect('/');
  }

  let products = []
  try {
    var callProducts
    if(req.query.category){
      callProducts  = fetchProductsByCommodity(req.query.category)
    }else{
      callProducts = fetchAllProducts()
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

// Registration page
app.get('/registration', (req, res) => {
  res.render('registration', { layout: false });
});

// Registration POST
app.post('/register', async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  
  // Basic validation
  if (!name || !email || !password || !confirm_password) {
    return res.render('registration', { 
      layout: false, 
      error: 'Semua field harus diisi' 
    });
  }
  
  if (password !== confirm_password) {
    return res.render('registration', { 
      layout: false, 
      error: 'Password tidak cocok' 
    });
  }
  
  try {
    // Insert user into database
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
      [name, email]
    );
    
    const userId = result.rows[0].id;
    
    // Create session with numeric user_id
    req.session.userId = userId;
    req.session.userEmail = email;
    req.session.userName = name;
    
    // Redirect to home after successful registration
    res.redirect('/home');
  } catch (err) {
    console.error('Registration error:', err);
    // If user already exists, try to login instead
    if (err.code === '23505') { // UNIQUE constraint violation
      return res.render('registration', { 
        layout: false, 
        error: 'Email sudah terdaftar' 
      });
    }
    res.render('registration', { 
      layout: false, 
      error: 'Gagal melakukan registrasi' 
    });
  }
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { layout: false });
});

// Login POST
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.render('login', { 
      layout: false, 
      error: 'Email dan Password harus diisi' 
    });
  }
  
  try {
    // Query user from database
    const result = await pool.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.render('login', { 
        layout: false, 
        error: 'Email atau password salah' 
      });
    }
    
    const user = result.rows[0];
    
    // Create session with numeric user_id
    req.session.userId = user.id;
    req.session.userEmail = email;
    req.session.userName = user.name;
    
    // Redirect to home after successful login
    res.redirect('/home');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { 
      layout: false, 
      error: 'Gagal melakukan login' 
    });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('error', { message: 'Failed to logout' });
    }
    res.redirect('/');
  });
});

// API: Get configuration (for frontend to access API URLs and user info)
app.get('/api/config', (req, res) => {
  res.json({
    cartApiUrl: process.env.CART_API_URL || 'https://lumitani.elcyone.my.id/api/cart',
    userId: req.session.userId || null,
    userName: req.session.userName || null,
    userEmail: req.session.userEmail || null
  });
});

// Catalog with category filter
app.get('/catalog', async(req, res) => {
  let products = []
 
  try {
    var callProducts
    if(req.query.category){
      callProducts  = fetchProductsByCommodity(req.query.category)
    }else{
      callProducts = fetchAllProducts()
    }
    const mappingFuncCall = [callProducts, fetchCategories()]
    let [dataProducts, dataCategories] = await Promise.all(mappingFuncCall)
    products = dataProducts.items
    categories = Array.isArray(dataCategories) ? dataCategories : (dataCategories.items || [])
  }catch(err) {
    console.log(err)
  }

  res.render('catalog', { products, categories, currentCategory: req.query.category || 'all' });
});

// Product detail page
app.get('/product/:id', async (req, res) => {
  try {
    const data = await fetchProductById(req.params.id);
    
    if (!data || !data.data || !data.data.items) {
      return res.status(404).render('404');
    }
    
    const product = data.data.items;
    res.render('product-detail', { product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).render('error', { message: 'Failed to load product' });
  }
});

// Cart page - renders empty cart, populated by API call in JS
app.get('/cart', (req, res) => {
  res.render('cart');
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

// Cart API routes
app.use('/api/cart', cartRoutes);

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
