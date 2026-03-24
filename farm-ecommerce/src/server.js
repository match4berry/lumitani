const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getProducts, fetchProductById, fetchProducts, fetchCategories } = require('./controllers/productController');
const { getCart, addToCart, removeFromCart } = require('./controllers/cartController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes

// Home page
app.get('/', async (req, res) => {
  // const products = getProducts();
  
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
    categories = dataCategories
  }catch(err) {
    console.log(err)
  }
  // const categories = ['sayuran', 'padi-padian', 'umbi-umbian', 'buah-buahan', 'bumbu-dapur'];
  res.render('catalog', { products, categories, currentCategory: 'all' });
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
app.get('/product/:id', async (req, res) => {
  let product = {}
  try {
    const {data} = await fetchProductById(req.params.id) 
    
    if (!data) {
      return res.status(404).render('404');
    }
    product = data.items
  } catch (error) {
    console.log(error)
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
