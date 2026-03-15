const express = require("express");
const session = require("express-session");
const { getProducts, getProductById } = require("./src/controllers/productController");
const { getCart, addToCart, removeFromCart } = require("./src/controllers/cartController");

const app = express();
const PORT = 3000;

/* ======================
   MIDDLEWARE
====================== */

// membaca file static (css, gambar)
app.use(express.static("public"));

// membaca input form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SESSION LOGIN
app.use(session({
    secret: "lumitani-secret",
    resave: false,
    saveUninitialized: true
}));

// template engine
app.set("view engine", "ejs");


/* ======================
   ROUTES
====================== */

// landing page (merges with catalog home)
app.get("/", (req, res) => {
    const products = getProducts();
    const categories = ['sayuran', 'padi-padian', 'umbi-umbian', 'buah-buahan', 'bumbu-dapur'];
    res.render("catalog", { 
        products, 
        categories, 
        currentCategory: 'all',
        loggedIn: req.session.loggedIn || false
    });
});

// halaman login
app.get("/login", (req, res) => {
    res.render("login");
});

// proses login
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === "admin@lumitani.com" && password === "admin123") {
        req.session.loggedIn = true;
        res.redirect("/");
    } else {
        res.send("Login gagal");
    }
});

// halaman katalog with category filter
app.get("/catalog", (req, res) => {
    const category = req.query.category || 'all';
    let products = getProducts();
    
    if (category !== 'all') {
        products = products.filter(p => p.category === category);
    }
    
    const categories = ['sayuran', 'padi-padian', 'umbi-umbian', 'buah-buahan', 'bumbu-dapur'];
    res.render("catalog", { products, categories, currentCategory: category });
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});


/* ======================
   SERVER
====================== */

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});