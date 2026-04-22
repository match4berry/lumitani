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
app.use(express.json());  // Explicit JSON parsing
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

// Registration POST - Call external API
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
    console.log('[REGISTER] Calling external API at http://localhost:8000/api/users/register');
    
    // Call external API
    const apiResponse = await fetch('http://localhost:8000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.log('[REGISTER] API error:', data);
      return res.render('registration', { 
        layout: false, 
        error: data.error || 'Gagal melakukan registrasi' 
      });
    }
    
    // API succeeded, save to session
    console.log('[REGISTER] User registered successfully, saving to session');
    req.session.userId = data.user.id;
    req.session.userEmail = data.user.email;
    req.session.userName = data.user.name;
    req.session.userToken = data.token;
    
    // Redirect to home
    res.redirect('/home');
  } catch (err) {
    console.error('[REGISTER] Error calling API:', err);
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

// Login POST - Call external API
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
    console.log('[LOGIN] Calling external API at http://localhost:8000/api/users/login');
    
    // Call external API
    const apiResponse = await fetch('http://localhost:8000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.log('[LOGIN] API error:', data);
      return res.render('login', { 
        layout: false, 
        error: data.error || 'Email atau password salah' 
      });
    }
    
    // API succeeded, save to session
    console.log('[LOGIN] User logged in successfully, saving to session');
    req.session.userId = data.user.id;
    req.session.userEmail = data.user.email;
    req.session.userName = data.user.name;
    req.session.userToken = data.token;
    
    // Redirect to home
    res.redirect('/home');
  } catch (err) {
    console.error('[LOGIN] Error calling API:', err);
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

// API: Get current user token (for authenticated API calls)
app.get('/api/users/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  console.log('[AUTH] User authenticated, returning token');
  res.json({
    success: true,
    token: req.session.userToken || null,
    user_id: req.session.userId,  // Include user_id at top level for API compatibility
    user: {
      id: req.session.userId,
      email: req.session.userEmail,
      name: req.session.userName
    }
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

// API: Get local orders from orders.json (for order-history page)
app.get('/order-history-json', (req, res) => {
  // No auth required - this is called by client-side JS
  try {
    const fs = require('fs');
    const ordersPath = path.join(__dirname, '../data/orders.json');
    const ordersData = fs.readFileSync(ordersPath, 'utf8');
    const allOrders = JSON.parse(ordersData);
    
    console.log('[ORDER-HISTORY] Read', allOrders.length, 'orders from JSON file');
    
    // Return orders directly - let client-side code handle transformation
    res.json({ orders: allOrders });
  } catch (error) {
    console.error('[ORDER-HISTORY] Error reading orders:', error);
    res.json({ orders: [] });
  }
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
  res.render('profile', {
    userName: req.session.userName || null,
    userEmail: req.session.userEmail || null,
    userId: req.session.userId || null
  });
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

// ===== CART PROXY API (calls external API) =====

// GET cart items for logged-in user
app.get('/api/cart', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    console.log('[CART GET] Fetching cart for user:', req.session.userId);
    
    // Call external API
    const apiResponse = await fetch(`http://localhost:8000/api/cart/user/${req.session.userId}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.userToken}`
      }
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('[CART GET] Error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST add item to cart
app.post('/api/cart', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { product_id, quantity = 1 } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: 'product_id is required' });
  }

  try {
    console.log('[CART ADD] Adding to cart for user:', req.session.userId);
    
    // Call external API
    const apiResponse = await fetch('http://localhost:8000/api/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.userToken}`
      },
      body: JSON.stringify({
        user_id: req.session.userId,
        product_id,
        quantity
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json(data);
    }

    res.status(apiResponse.status).json(data);
  } catch (err) {
    console.error('[CART ADD] Error:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT update cart item quantity
app.put('/api/cart/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be at least 1' });
  }

  try {
    console.log('[CART UPDATE] Updating quantity for user:', req.session.userId);
    
    // Call external API
    const apiResponse = await fetch(`http://localhost:8000/api/cart/${req.params.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.userToken}`
      },
      body: JSON.stringify({ quantity })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('[CART UPDATE] Error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE remove item from cart
app.delete('/api/cart/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    console.log('[CART DELETE] Deleting cart item for user:', req.session.userId);
    
    // Call external API
    const apiResponse = await fetch(`http://localhost:8000/api/cart/${req.params.id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.session.userToken}`
      }
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('[CART DELETE] Error:', err);
    res.status(500).json({ error: 'Failed to delete from cart' });
  }
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
