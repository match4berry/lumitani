// ===== DATA =====
const PRODUCTS_DB = {
    'bayam-organik': {
        id: 'bayam-organik',
        name: 'Bayam Organik',
        price: 10000,
        image: 'https://images.unsplash.com/photo-1741515042603-70545daeb0c4?w=400',
        farmer: 'Pak Budi - Desa Manud Jaya',
        stock: 50,
        lastHarvest: '2 hari yang lalu',
        description: 'Bayam organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Kaya akan zat besi dan vitamin A untuk kesehatan keluarga.',
        unit: 'per ikat (250g)',
        category: 'Sayuran Hijau'
    },
    'kangkung-segar': {
        id: 'kangkung-segar',
        name: 'Kangkung Segar',
        price: 10000,
        image: 'https://images.unsplash.com/photo-1767334573903-f280cb211993?w=400',
        farmer: 'Ibu Siti - Desa Manud Jaya',
        stock: 45,
        lastHarvest: '1 hari yang lalu',
        description: 'Kangkung organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Renyah dan segar untuk berbagai masakan.',
        unit: 'per ikat (300g)',
        category: 'Sayuran Hijau'
    },
    'tomat-merah': {
        id: 'tomat-merah',
        name: 'Tomat Merah',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?w=400',
        farmer: 'Pak Ahmad - Desa Manud Jaya',
        stock: 60,
        lastHarvest: '3 hari yang lalu',
        description: 'Tomat merah organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Manis dan segar untuk masakan atau jus.',
        unit: 'per kg',
        category: 'Sayuran Merah'
    },
    'wortel-fresh': {
        id: 'wortel-fresh',
        name: 'Wortel Fresh',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1741515044901-58696421d24a?w=400',
        farmer: 'Pak Joko - Desa Manud Jaya',
        stock: 40,
        lastHarvest: '2 hari yang lalu',
        description: 'Wortel organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Kaya vitamin A dan cocok untuk berbagai masakan.',
        unit: 'per kg',
        category: 'Umbi-umbian'
    },
    'cabai-rawit': {
        id: 'cabai-rawit',
        name: 'Cabai Rawit',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1601876818790-33a0783ec542?w=400',
        farmer: 'Ibu Ani - Desa Manud Jaya',
        stock: 30,
        lastHarvest: '1 hari yang lalu',
        description: 'Cabai rawit organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Pedas dan segar untuk masakan Indonesia.',
        unit: 'per 100g',
        category: 'Rempah'
    },
    'sawi-hijau': {
        id: 'sawi-hijau',
        name: 'Sawi Hijau',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?w=400',
        farmer: 'Pak Budi - Desa Manud Jaya',
        stock: 55,
        lastHarvest: '2 hari yang lalu',
        description: 'Sawi hijau organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Renyah dan segar untuk sup atau tumisan.',
        unit: 'per ikat (400g)',
        category: 'Sayuran Hijau'
    },
    'brokoli-segar': {
        id: 'brokoli-segar',
        name: 'Brokoli Segar',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1757332051618-c7ee2f6f570a?w=400',
        farmer: 'Ibu Siti - Desa Manud Jaya',
        stock: 35,
        lastHarvest: '3 hari yang lalu',
        description: 'Brokoli organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Kaya nutrisi dan cocok untuk menu sehat keluarga.',
        unit: 'per bonggol (500g)',
        category: 'Sayuran Hijau'
    },
    'terong-ungu': {
        id: 'terong-ungu',
        name: 'Terong Ungu',
        price: 14000,
        image: 'https://images.unsplash.com/photo-1659261111792-66709e46d53d?w=400',
        farmer: 'Pak Ahmad - Desa Manud Jaya',
        stock: 42,
        lastHarvest: '2 hari yang lalu',
        description: 'Terong ungu organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. Cocok untuk berbagai masakan tradisional.',
        unit: 'per kg',
        category: 'Sayuran Merah'
    }
};

const BESTSELLERS = ['bayam-organik', 'kangkung-segar', 'tomat-merah', 'wortel-fresh', 'cabai-rawit', 'sawi-hijau', 'brokoli-segar', 'terong-ungu'];

// ===== STATE MANAGEMENT =====
class Store {
    constructor() {
        this.cart = this.loadFromStorage('lumitani_cart') || [];
        this.orders = this.loadFromStorage('lumitani_orders') || [];
        this.user = this.loadFromStorage('lumitani_user') || null;
        this.addedProductId = null;
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Cart methods
    addToCart(product) {
        const existingItem = this.cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveToStorage('lumitani_cart', this.cart);
        this.updateCartBadge();
        this.addedProductId = product.name;
        setTimeout(() => this.addedProductId = null, 2000);
    }

    updateQuantity(productName, quantity) {
        const item = this.cart.find(item => item.name === productName);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeFromCart(productName);
            } else {
                this.saveToStorage('lumitani_cart', this.cart);
            }
        }
    }

    removeFromCart(productName) {
        this.cart = this.cart.filter(item => item.name !== productName);
        this.saveToStorage('lumitani_cart', this.cart);
        this.updateCartBadge();
    }

    clearCart() {
        this.cart = [];
        this.saveToStorage('lumitani_cart', this.cart);
        this.updateCartBadge();
    }

    getTotalPrice() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        const total = this.getTotalItems();
        if (badge) {
            badge.textContent = total;
            badge.classList.toggle('hidden', total === 0);
        }
    }

    // Order methods
    createOrder(shippingAddress, paymentMethod) {
        const orderId = `LT${Date.now()}${Math.floor(Math.random() * 10000)}`;
        const status = paymentMethod === 'COD' ? 'Menunggu Diproses' : 'Menunggu Pembayaran';
        
        const order = {
            id: orderId,
            userId: this.user?.email || 'guest',
            items: this.cart.map(item => ({
                productName: item.name,
                quantity: item.quantity,
                pricePerUnit: item.price,
                priceAtOrder: item.price * item.quantity,
                image: item.image
            })),
            shippingAddress,
            totalPrice: this.getTotalPrice(),
            paymentMethod,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.orders.unshift(order);
        this.saveToStorage('lumitani_orders', this.orders);
        return order;
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    getUserOrders() {
        if (!this.user) return [];
        return this.orders.filter(order => order.userId === this.user.email);
    }

    // Auth methods
    login(email, password) {
        // Simple mock authentication
        const users = this.loadFromStorage('lumitani_users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.user = { name: user.name, email: user.email };
            this.saveToStorage('lumitani_user', this.user);
            return { success: true };
        }
        return { success: false, error: 'Email atau password salah' };
    }

    register(name, email, password) {
        const users = this.loadFromStorage('lumitani_users') || [];
        
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email sudah terdaftar' };
        }

        users.push({ name, email, password });
        this.saveToStorage('lumitani_users', users);
        
        this.user = { name, email };
        this.saveToStorage('lumitani_user', this.user);
        return { success: true };
    }

    logout() {
        this.user = null;
        localStorage.removeItem('lumitani_user');
    }

    isLoggedIn() {
        return this.user !== null;
    }
}

const store = new Store();

// ===== UTILITIES =====
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
}

function getProductIdFromName(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

function getStatusColor(status) {
    const colors = {
        'Menunggu Pembayaran': 'status-orange',
        'Menunggu Diproses': 'status-yellow',
        'Diproses': 'status-blue',
        'Dikirim': 'status-purple',
        'Selesai': 'status-green',
        'Dibatalkan': 'status-red'
    };
    return colors[status] || 'status-yellow';
}

// ===== ROUTING =====
function navigateTo(path) {
    window.location.hash = path;
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const pages = document.querySelectorAll('.page');
    
    pages.forEach(page => page.classList.remove('active'));

    // Parse route
    const [, route, param] = hash.match(/^\/([^\/]*)\/?(.*)$/) || ['', '', ''];

    switch (route) {
        case '':
        case 'home':
            showPage('page-landing');
            renderBestSellers();
            updateBottomNav('home');
            break;
        case 'catalog':
            showPage('page-catalog');
            renderCatalog(param);
            cloneBottomNav('catalog-bottom-nav', 'catalog');
            break;
        case 'product':
            showPage('page-product-detail');
            renderProductDetail(param);
            break;
        case 'cart':
            showPage('page-cart');
            renderCart();
            cloneBottomNav('cart-bottom-nav', 'cart');
            break;
        case 'checkout':
            if (!store.isLoggedIn()) {
                navigateTo('/login');
                return;
            }
            showPage('page-checkout');
            renderCheckout();
            break;
        case 'order-success':
            showPage('page-order-success');
            renderOrderSuccess(param);
            break;
        case 'my-orders':
            if (!store.isLoggedIn()) {
                navigateTo('/login');
                return;
            }
            showPage('page-my-orders');
            renderMyOrders();
            cloneBottomNav('orders-bottom-nav', 'profile');
            break;
        case 'order-detail':
            showPage('page-order-detail');
            renderOrderDetail(param);
            break;
        case 'profile':
            showPage('page-profile');
            renderProfile();
            cloneBottomNav('profile-bottom-nav', 'profile');
            break;
        case 'login':
            showPage('page-login');
            break;
        case 'register':
            showPage('page-register');
            break;
        default:
            showPage('page-landing');
            renderBestSellers();
    }

    store.updateCartBadge();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function updateBottomNav(active) {
    const items = document.querySelectorAll('.bottom-nav .nav-item');
    items.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.remove('active');
        if ((active === 'home' && href === '#/') ||
            (active === 'catalog' && href === '#/catalog/all') ||
            (active === 'cart' && href === '#/cart') ||
            (active === 'profile' && href === '#/profile')) {
            item.classList.add('active');
        }
    });
}

function cloneBottomNav(targetId, active) {
    const target = document.getElementById(targetId);
    if (target) {
        const original = document.querySelector('#page-landing .bottom-nav');
        target.innerHTML = original.innerHTML;
        updateBottomNav(active);
    }
}

// ===== SIDEBAR =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// ===== RENDER FUNCTIONS =====
function renderBestSellers() {
    const container = document.getElementById('bestseller-products');
    if (!container) return;

    const html = BESTSELLERS.slice(0, 4).map(id => {
        const product = PRODUCTS_DB[id];
        return createProductCard(product, true);
    }).join('');

    container.innerHTML = html;
}

function renderCatalog(type) {
    const container = document.getElementById('catalog-products');
    const title = document.getElementById('catalog-title');
    
    if (type === 'bestseller') {
        title.textContent = 'Best Seller';
    } else {
        title.textContent = 'Katalog Produk';
    }

    const products = type === 'bestseller' 
        ? BESTSELLERS.map(id => PRODUCTS_DB[id])
        : Object.values(PRODUCTS_DB);

    const html = products.map(product => createProductCard(product, type === 'bestseller')).join('');
    container.innerHTML = html;
}

function createProductCard(product, isBestSeller = false) {
    const isAdded = store.addedProductId === product.name;
    
    return `
        <div class="product-card">
            <div class="product-image-container" onclick="navigateTo('/product/${product.id}')">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${isBestSeller ? '<div class="product-badge">⭐ Best</div>' : ''}
                <div class="product-overlay">
                    <div class="overlay-button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Lihat Detail
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name" onclick="navigateTo('/product/${product.id}')">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button class="product-btn product-btn-detail" onclick="navigateTo('/product/${product.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Detail
                    </button>
                    <button class="product-btn ${isAdded ? 'product-btn-added' : 'product-btn-add'}" 
                            onclick="addToCart('${product.id}')">
                        ${isAdded ? `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ` : `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        `}
                        ${isAdded ? 'Added' : 'Tambah'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProductDetail(productId) {
    const container = document.getElementById('product-detail-content');
    const product = PRODUCTS_DB[productId];

    if (!product) {
        container.innerHTML = `
            <div class="product-detail-content">
                <div class="cart-empty">
                    <div class="empty-icon">📦</div>
                    <h2 class="empty-title">Produk tidak ditemukan</h2>
                    <button class="btn btn-primary" onclick="navigateTo('/catalog/all')">
                        Kembali ke Katalog
                    </button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-detail-image">
        <div class="product-detail-content">
            <div class="detail-card">
                <h1 class="detail-title">${product.name}</h1>
                <p class="detail-price">${formatPrice(product.price)}</p>
                <p class="detail-unit">${product.unit}</p>
            </div>

            <div class="detail-card">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-icon green">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="info-label">Petani</p>
                            <p class="info-value">${product.farmer}</p>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-icon blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="info-label">Stok Tersedia</p>
                            <p class="info-value">${product.stock} ${product.unit}</p>
                        </div>
                    </div>

                    <div class="info-item full-width">
                        <div class="info-icon orange">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <div>
                            <p class="info-label">Panen Terakhir</p>
                            <p class="info-value">${product.lastHarvest}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-card">
                <h2 class="section-heading">Deskripsi Produk</h2>
                <p class="description-text">${product.description}</p>
            </div>

            <div class="detail-card benefits-box">
                <h3 class="benefits-title">✨ Keunggulan Produk</h3>
                <ul class="benefits-list">
                    <li><span>✓</span> 100% organik tanpa pestisida kimia</li>
                    <li><span>✓</span> Dipanen segar langsung dari kebun</li>
                    <li><span>✓</span> Mendukung petani lokal Desa Manud Jaya</li>
                    <li><span>✓</span> Harga transparan langsung dari petani</li>
                </ul>
            </div>
        </div>

        <div class="floating-actions">
            <div class="actions-grid">
                <button class="action-btn action-btn-cart" onclick="addToCartFromDetail('${product.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Keranjang
                </button>
                <button class="action-btn action-btn-buy" onclick="buyNow('${product.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Beli Sekarang
                </button>
            </div>
        </div>
    `;
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    
    if (store.cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛒</div>
                <h2 class="empty-title">Keranjang Kosong</h2>
                <p class="empty-text">Belum ada produk di keranjang</p>
                <button class="btn btn-primary" onclick="navigateTo('/catalog/all')">
                    Mulai Belanja
                </button>
            </div>
        `;
        return;
    }

    const itemsHtml = store.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = itemsHtml + `
        <div class="cart-summary">
            <div class="summary-row">
                <span class="summary-label">Total Belanja</span>
                <span class="summary-value">${formatPrice(store.getTotalPrice())}</span>
            </div>
            <button class="btn btn-primary btn-full" onclick="navigateTo('/checkout')">
                Lanjut ke Checkout
            </button>
        </div>
    `;
}

function renderCheckout() {
    const container = document.getElementById('checkout-content');
    const user = store.user;

    container.innerHTML = `
        <form id="checkout-form">
            <div class="checkout-section">
                <div class="section-card">
                    <div class="card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <h2 class="card-title">Alamat Pengiriman</h2>
                    </div>
                    <div class="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" id="shipping-name" value="${user?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Nomor Telepon</label>
                        <input type="tel" id="shipping-phone" placeholder="08xxxxxxxxxx" required>
                    </div>
                    <div class="form-group">
                        <label>Alamat Lengkap</label>
                        <input type="text" id="shipping-address" placeholder="Jalan, Nomor Rumah, RT/RW" required>
                    </div>
                    <div class="form-group">
                        <label>Kota</label>
                        <input type="text" id="shipping-city" placeholder="Nama Kota" required>
                    </div>
                    <div class="form-group">
                        <label>Kode Pos</label>
                        <input type="text" id="shipping-postal" placeholder="12345" required>
                    </div>
                    <div class="form-group">
                        <label>Catatan (Opsional)</label>
                        <input type="text" id="shipping-notes" placeholder="Catatan untuk kurir">
                    </div>
                </div>
            </div>

            <div class="checkout-section">
                <div class="section-card">
                    <div class="card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        <h2 class="card-title">Metode Pembayaran</h2>
                    </div>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="payment" value="Transfer Bank" required>
                            <div class="radio-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                            </div>
                            <div class="radio-label">
                                <div class="radio-text">Transfer Bank</div>
                                <div class="radio-subtext">BCA, Mandiri, BNI</div>
                            </div>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="payment" value="E-Wallet" required>
                            <div class="radio-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div class="radio-label">
                                <div class="radio-text">E-Wallet</div>
                                <div class="radio-subtext">GoPay, OVO, Dana</div>
                            </div>
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="payment" value="COD" required>
                            <div class="radio-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <div class="radio-label">
                                <div class="radio-text">COD</div>
                                <div class="radio-subtext">Bayar saat terima</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="checkout-section">
                <div class="section-card">
                    <div class="card-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <h2 class="card-title">Ringkasan Pesanan</h2>
                    </div>
                    ${store.cart.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                            <span>${item.name} (x${item.quantity})</span>
                            <span>${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                    <div style="border-top: 1px solid var(--color-gray-200); padding-top: 0.75rem; margin-top: 0.75rem; display: flex; justify-content: space-between; font-weight: 700;">
                        <span>Total</span>
                        <span style="color: var(--color-primary); font-size: 1.25rem;">${formatPrice(store.getTotalPrice())}</span>
                    </div>
                </div>
            </div>

            <div id="checkout-error" class="form-error hidden"></div>

            <button type="submit" class="btn btn-primary btn-full">
                Buat Pesanan
            </button>
        </form>
    `;

    // Add payment method selection handler
    document.querySelectorAll('.radio-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });

    // Form submit handler
    document.getElementById('checkout-form').addEventListener('submit', handleCheckoutSubmit);
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    
    if (!paymentMethod) {
        const error = document.getElementById('checkout-error');
        error.textContent = 'Silakan pilih metode pembayaran';
        error.classList.remove('hidden');
        return;
    }

    const shippingAddress = {
        name: document.getElementById('shipping-name').value,
        phone: document.getElementById('shipping-phone').value,
        address: document.getElementById('shipping-address').value,
        city: document.getElementById('shipping-city').value,
        postalCode: document.getElementById('shipping-postal').value,
        notes: document.getElementById('shipping-notes').value
    };

    const order = store.createOrder(shippingAddress, paymentMethod);
    store.clearCart();
    
    navigateTo(`/order-success/${order.id}`);
}

function renderOrderSuccess(orderId) {
    const container = document.getElementById('order-success-content');
    const order = store.getOrderById(orderId);

    if (!order) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">📦</div>
                <h2 class="empty-title">Pesanan tidak ditemukan</h2>
                <button class="btn btn-primary" onclick="navigateTo('/')">
                    Kembali ke Beranda
                </button>
            </div>
        `;
        return;
    }

    const paymentInstructions = order.status === 'Menunggu Pembayaran' ? `
        <div class="detail-card" style="background: var(--color-orange-100); border: 1px solid #fed7aa;">
            <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
                <svg style="width: 1.25rem; height: 1.25rem; stroke: var(--color-orange-600); flex-shrink: 0; margin-top: 0.125rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div>
                    <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-orange-700); margin-bottom: 0.5rem;">
                        Menunggu Pembayaran
                    </p>
                    <p style="font-size: 0.75rem; color: var(--color-orange-700); margin-bottom: 0.75rem;">
                        Silakan lakukan pembayaran untuk melanjutkan pesanan Anda.
                    </p>
                </div>
            </div>
            ${order.paymentMethod === 'Transfer Bank' ? `
                <div style="background: var(--color-white); border-radius: 0.5rem; padding: 0.75rem; font-size: 0.75rem;">
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">Instruksi Transfer Bank:</p>
                    <p style="margin-bottom: 0.25rem;">Bank BCA</p>
                    <p style="margin-bottom: 0.25rem;">No. Rekening: <strong>1234567890</strong></p>
                    <p style="margin-bottom: 0.75rem;">a.n. LumiTani</p>
                    <div style="border-top: 1px solid var(--color-gray-200); padding-top: 0.5rem;">
                        <p>Total Transfer:</p>
                        <p style="color: var(--color-primary); font-size: 1rem; font-weight: 700;">${formatPrice(order.totalPrice)}</p>
                    </div>
                </div>
            ` : `
                <div style="background: var(--color-white); border-radius: 0.5rem; padding: 0.75rem; font-size: 0.75rem;">
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">Instruksi E-Wallet:</p>
                    <p style="margin-bottom: 0.25rem;">GoPay / OVO / Dana</p>
                    <p style="margin-bottom: 0.25rem;">No. HP: <strong>0812-3456-7890</strong></p>
                    <p style="margin-bottom: 0.75rem;">a.n. LumiTani</p>
                    <div style="border-top: 1px solid var(--color-gray-200); padding-top: 0.5rem;">
                        <p>Total Transfer:</p>
                        <p style="color: var(--color-primary); font-size: 1rem; font-weight: 700;">${formatPrice(order.totalPrice)}</p>
                    </div>
                </div>
            `}
        </div>
    ` : `
        <div class="detail-card" style="background: var(--color-blue-100); border: 1px solid #bfdbfe;">
            <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-blue-700); margin-bottom: 0.5rem;">
                Pesanan Anda sedang diproses
            </p>
            <p style="font-size: 0.75rem; color: var(--color-blue-700);">
                Pembayaran akan dilakukan saat barang diterima (COD). Admin kami akan segera memproses pesanan Anda.
            </p>
        </div>
    `;

    container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
            <div style="background: var(--color-primary-light); width: 6rem; height: 6rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                <svg style="width: 3rem; height: 3rem; stroke: var(--color-primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">Pesanan Berhasil!</h1>
            <p style="color: var(--color-gray-600); margin-bottom: 1.5rem;">Terima kasih telah berbelanja di LumiTani</p>
        </div>

        <div style="padding: 0 1rem 5rem;">
            <div class="detail-card">
                <div class="card-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h2 class="card-title">Detail Pesanan</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--color-gray-600);">ID Pesanan</span>
                        <span style="font-weight: 600;">${order.id}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--color-gray-600);">Tanggal Pesanan</span>
                        <span>${formatDate(order.createdAt)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--color-gray-600);">Status</span>
                        <span class="status-badge ${getStatusColor(order.status)}">${order.status}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--color-gray-600);">Metode Pembayaran</span>
                        <span style="font-weight: 600;">${order.paymentMethod}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--color-gray-200); padding-top: 0.75rem; margin-top: 0.5rem;">
                        <span style="font-weight: 700;">Total Pembayaran</span>
                        <span style="font-size: 1.125rem; color: var(--color-primary); font-weight: 700;">${formatPrice(order.totalPrice)}</span>
                    </div>
                </div>
            </div>

            ${paymentInstructions}

            <div style="display: flex; gap: 0.75rem;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="navigateTo('/my-orders')">
                    Lihat Pesanan
                </button>
                <button class="btn btn-primary" style="flex: 1;" onclick="navigateTo('/')">
                    Kembali
                </button>
            </div>
        </div>
    `;
}

function renderMyOrders() {
    const container = document.getElementById('my-orders-content');
    const orders = store.getUserOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">📦</div>
                <h2 class="empty-title">Belum Ada Pesanan</h2>
                <p class="empty-text">Mulai belanja sekarang</p>
                <button class="btn btn-primary" onclick="navigateTo('/catalog/all')">
                    Belanja Sekarang
                </button>
            </div>
        `;
        return;
    }

    const html = orders.map(order => `
        <div class="detail-card" onclick="navigateTo('/order-detail/${order.id}')" style="cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                    <p style="font-size: 0.75rem; color: var(--color-gray-600);">ID Pesanan</p>
                    <p style="font-weight: 600;">${order.id}</p>
                </div>
                <span class="status-badge ${getStatusColor(order.status)}">${order.status}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
                ${order.items.slice(0, 3).map(item => `
                    <img src="${item.image}" alt="${item.productName}" style="width: 4rem; height: 4rem; border-radius: 0.5rem; object-fit: cover;">
                `).join('')}
                ${order.items.length > 3 ? `<div style="width: 4rem; height: 4rem; border-radius: 0.5rem; background: var(--color-gray-200); display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--color-gray-600);">+${order.items.length - 3}</div>` : ''}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-gray-200); padding-top: 0.75rem;">
                <span style="font-size: 0.75rem; color: var(--color-gray-600);">${formatDate(order.createdAt)}</span>
                <span style="font-weight: 700; color: var(--color-primary);">${formatPrice(order.totalPrice)}</span>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function renderOrderDetail(orderId) {
    const container = document.getElementById('order-detail-content');
    const order = store.getOrderById(orderId);

    if (!order) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">📦</div>
                <h2 class="empty-title">Pesanan tidak ditemukan</h2>
                <button class="btn btn-primary" onclick="navigateTo('/my-orders')">
                    Kembali
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="detail-card" style="background: ${order.status === 'Menunggu Pembayaran' ? 'var(--color-orange-100)' : 'var(--color-yellow-100)'}; border: 2px solid ${order.status === 'Menunggu Pembayaran' ? '#fed7aa' : '#fde68a'};">
            <div style="text-align: center; padding: 1rem;">
                <span class="status-badge ${getStatusColor(order.status)}" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                    ${order.status}
                </span>
            </div>
        </div>

        <div class="detail-card">
            <div class="card-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                </svg>
                <h2 class="card-title">Informasi Pesanan</h2>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.875rem;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--color-gray-600);">ID Pesanan</span>
                    <span style="font-weight: 600; text-align: right;">${order.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--color-gray-600);">Tanggal Pesanan</span>
                    <span style="text-align: right;">${formatDate(order.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--color-gray-600);">Terakhir Update</span>
                    <span style="text-align: right;">${formatDate(order.updatedAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--color-gray-200); padding-top: 0.75rem;">
                    <span style="color: var(--color-gray-600);">Metode Pembayaran</span>
                    <span style="font-weight: 600; text-align: right;">${order.paymentMethod}</span>
                </div>
            </div>
        </div>

        <div class="detail-card">
            <div class="card-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h2 class="card-title">Alamat Pengiriman</h2>
            </div>
            <div style="font-size: 0.875rem;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">${order.shippingAddress.name}</p>
                <p style="color: var(--color-gray-600); margin-bottom: 0.25rem;">${order.shippingAddress.phone}</p>
                <p style="color: var(--color-gray-600); margin-bottom: 0.25rem;">${order.shippingAddress.address}</p>
                <p style="color: var(--color-gray-600);">${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                ${order.shippingAddress.notes ? `<p style="color: var(--color-gray-600); margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--color-gray-100);"><span style="font-size: 0.75rem;">Catatan:</span> ${order.shippingAddress.notes}</p>` : ''}
            </div>
        </div>

        <div class="detail-card">
            <div class="card-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h2 class="card-title">Produk yang Dipesan</h2>
            </div>
            ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-gray-100); margin-bottom: 0.75rem;">
                    <div>
                        <p style="font-size: 0.875rem; margin-bottom: 0.25rem;">${item.productName}</p>
                        <p style="font-size: 0.75rem; color: var(--color-gray-600);">${formatPrice(item.pricePerUnit)} x ${item.quantity}</p>
                    </div>
                    <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-primary);">${formatPrice(item.priceAtOrder)}</p>
                </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; font-weight: 700; padding-top: 0.5rem;">
                <span>Total</span>
                <span style="font-size: 1.25rem; color: var(--color-primary);">${formatPrice(order.totalPrice)}</span>
            </div>
        </div>

        ${order.status === 'Menunggu Pembayaran' ? `
            <div class="detail-card" style="background: var(--color-orange-100); border: 1px solid #fed7aa;">
                <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-orange-700); margin-bottom: 0.5rem;">Menunggu Pembayaran</p>
                <p style="font-size: 0.75rem; color: var(--color-orange-700);">Silakan selesaikan pembayaran untuk melanjutkan pesanan. Pesanan akan otomatis dibatalkan jika pembayaran tidak diterima dalam 24 jam.</p>
            </div>
        ` : order.status === 'Menunggu Diproses' ? `
            <div class="detail-card" style="background: var(--color-blue-100); border: 1px solid #bfdbfe;">
                <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-blue-700); margin-bottom: 0.5rem;">Pesanan sedang diproses</p>
                <p style="font-size: 0.75rem; color: var(--color-blue-700);">Admin kami akan segera memproses pesanan Anda. Mohon menunggu konfirmasi lebih lanjut.</p>
            </div>
        ` : ''}
    `;
}

function renderProfile() {
    const container = document.getElementById('profile-content');
    const user = store.user;

    if (!user) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">👤</div>
                <h2 class="empty-title">Belum Login</h2>
                <p class="empty-text">Masuk untuk mengakses profil</p>
                <button class="btn btn-primary" onclick="navigateTo('/login')">
                    Masuk
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="detail-card" style="text-align: center;">
            <div style="width: 5rem; height: 5rem; border-radius: 50%; background: var(--color-primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                <svg style="width: 3rem; height: 3rem; stroke: var(--color-primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">${user.name}</h2>
            <p style="color: var(--color-gray-600); font-size: 0.875rem;">${user.email}</p>
        </div>

        <div class="detail-card">
            <a href="#/my-orders" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-100);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <svg style="width: 1.25rem; height: 1.25rem; stroke: var(--color-gray-600);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8"></path>
                    </svg>
                    <span>Pesanan Saya</span>
                </div>
                <svg style="width: 1rem; height: 1rem; stroke: var(--color-gray-400);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </a>
            <a href="#/about" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-100);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <svg style="width: 1.25rem; height: 1.25rem; stroke: var(--color-gray-600);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Tentang LumiTani</span>
                </div>
                <svg style="width: 1rem; height: 1rem; stroke: var(--color-gray-400);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </a>
            <a href="#/contact" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <svg style="width: 1.25rem; height: 1.25rem; stroke: var(--color-gray-600);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2"></path>
                    </svg>
                    <span>Hubungi Kami</span>
                </div>
                <svg style="width: 1rem; height: 1rem; stroke: var(--color-gray-400);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </a>
        </div>

        <button class="btn btn-secondary btn-full" onclick="handleLogout()">
            Keluar
        </button>
    `;
}

// ===== EVENT HANDLERS =====
function addToCart(productId) {
    const product = PRODUCTS_DB[productId];
    if (product) {
        store.addToCart(product);
        showToast('Ditambahkan ke keranjang!');
        
        // Re-render current page to show "Added" state
        handleRoute();
    }
}

function addToCartFromDetail(productId) {
    const product = PRODUCTS_DB[productId];
    if (product) {
        store.addToCart(product);
        showToast('Ditambahkan ke keranjang!');
    }
}

function buyNow(productId) {
    const product = PRODUCTS_DB[productId];
    if (product) {
        store.addToCart(product);
        navigateTo('/checkout');
    }
}

function updateQuantity(productName, quantity) {
    store.updateQuantity(productName, quantity);
    renderCart();
    store.updateCartBadge();
}

function handleLogout() {
    if (confirm('Yakin ingin keluar?')) {
        store.logout();
        navigateTo('/');
    }
}

// ===== AUTH HANDLERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const result = store.login(email, password);
            if (result.success) {
                showToast('Login berhasil!');
                navigateTo('/');
            } else {
                alert(result.error);
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            if (password.length < 6) {
                alert('Password minimal 6 karakter');
                return;
            }
            
            const result = store.register(name, email, password);
            if (result.success) {
                showToast('Registrasi berhasil!');
                navigateTo('/');
            } else {
                alert(result.error);
            }
        });
    }
});

// ===== INITIALIZE =====
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', function() {
    handleRoute();
    store.updateCartBadge();
});
