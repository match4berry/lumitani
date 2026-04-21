// ===== APP STATE =====
const state = {
    currentPage: 'home',
    user: null,
    cart: [],
    orders: [],
    wishlist: [],
    addresses: [],
    isLoggedIn: false
};

// ===== PRODUCT DATABASE =====
const products = [
    { id: 'bayam-organik', name: 'Bayam Organik', price: 10000, image: 'https://images.unsplash.com/photo-1741515042603-70545daeb0c4?w=400', farmer: 'Pak Budi - Desa Manud Jaya', stock: 50, unit: 'per ikat (250g)', category: 'Sayuran Hijau' },
    { id: 'kangkung-segar', name: 'Kangkung Segar', price: 10000, image: 'https://images.unsplash.com/photo-1767334573903-f280cb211993?w=400', farmer: 'Ibu Siti - Desa Manud Jaya', stock: 45, unit: 'per ikat (300g)', category: 'Sayuran Hijau' },
    { id: 'tomat-merah', name: 'Tomat Merah', price: 18000, image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?w=400', farmer: 'Pak Ahmad - Desa Manud Jaya', stock: 60, unit: 'per kg', category: 'Buah-buahan' },
    { id: 'wortel-fresh', name: 'Wortel Fresh', price: 15000, image: 'https://images.unsplash.com/photo-1741515044901-58696421d24a?w=400', farmer: 'Pak Joko - Desa Manud Jaya', stock: 40, unit: 'per kg', category: 'Umbi-umbian' },
    { id: 'cabai-rawit', name: 'Cabai Rawit', price: 35000, image: 'https://images.unsplash.com/photo-1601876818790-33a0783ec542?w=400', farmer: 'Ibu Ani - Desa Manud Jaya', stock: 30, unit: 'per 100g', category: 'Bumbu Dapur' },
    { id: 'sawi-hijau', name: 'Sawi Hijau', price: 12000, image: 'https://images.unsplash.com/photo-1700150618387-3f46b6d2cf8e?w=400', farmer: 'Pak Budi - Desa Manud Jaya', stock: 55, unit: 'per ikat (400g)', category: 'Sayuran Hijau' },
    { id: 'brokoli-segar', name: 'Brokoli Segar', price: 25000, image: 'https://images.unsplash.com/photo-1757332051618-c7ee2f6f570a?w=400', farmer: 'Ibu Siti - Desa Manud Jaya', stock: 35, unit: 'per bonggol (500g)', category: 'Sayuran Hijau' },
    { id: 'terong-ungu', name: 'Terong Ungu', price: 14000, image: 'https://images.unsplash.com/photo-1659261111792-66709e46d53d?w=400', farmer: 'Pak Ahmad - Desa Manud Jaya', stock: 42, unit: 'per kg', category: 'Sayuran Hijau' }
];

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'flex';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

// ===== LOCAL STORAGE =====
function loadFromStorage() {
    state.user = JSON.parse(localStorage.getItem('lumitani_auth'))?.user || null;
    state.isLoggedIn = JSON.parse(localStorage.getItem('lumitani_auth'))?.isLoggedIn || false;
    state.cart = JSON.parse(localStorage.getItem('lumitani_cart')) || [];
    state.orders = JSON.parse(localStorage.getItem('lumitani_orders')) || [];
    state.wishlist = JSON.parse(localStorage.getItem('lumitani_wishlist')) || [];
    state.addresses = JSON.parse(localStorage.getItem('lumitani_addresses')) || [];
    updateCartBadge();
}

function saveToStorage() {
    localStorage.setItem('lumitani_auth', JSON.stringify({ isLoggedIn: state.isLoggedIn, user: state.user }));
    localStorage.setItem('lumitani_cart', JSON.stringify(state.cart));
    localStorage.setItem('lumitani_orders', JSON.stringify(state.orders));
    localStorage.setItem('lumitani_wishlist', JSON.stringify(state.wishlist));
    localStorage.setItem('lumitani_addresses', JSON.stringify(state.addresses));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    
    // Try to get cart count from API first
    fetch('/api/cart', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then(r => {
        if (r.ok) return r.json();
        return null;
    })
    .then(data => {
        if (data && data.items) {
            // Use API data as source of truth
            const totalQty = data.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            if (totalQty > 0 && badge) {
                badge.textContent = totalQty;
                badge.style.display = 'block';
            } else if (badge) {
                badge.style.display = 'none';
            }
        } else {
            // Fallback to localStorage if API not available
            const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            if (count > 0 && badge) {
                badge.textContent = count;
                badge.style.display = 'block';
            } else if (badge) {
                badge.style.display = 'none';
            }
        }
    })
    .catch(() => {
        // Fallback to localStorage on error
        if (badge) {
            const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    });
}

// ===== CART FUNCTIONS =====
// function addToCart(product) {
//     const existingItem = state.cart.find(item => item.name === product.name);
//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         state.cart.push({
//             name: product.name,
//             price: product.price,
//             image: product.image,
//             quantity: 1
//         });
//     }
//     saveToStorage();
//     showToast('Produk ditambahkan ke keranjang!');
// }

async function addToCart(productId) {
    try {
        console.log('[SCRIPT] Checking login status...');
        
        // Check if user is logged in by making a test request
        const cartRes = await fetch('/api/cart', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (cartRes.status === 401) {
            alert('Silakan login terlebih dahulu');
            window.location.href = '/login';
            return;
        }
        
        console.log('[SCRIPT] Adding to cart:', { productId });
        
        // Call local proxy cart API
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            }),
            credentials: 'include'
        });
        
        if (response.status === 401) {
            alert('Silakan login terlebih dahulu');
            window.location.href = '/login';
            return;
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add to cart');
        }
        
        const data = await response.json();
        console.log('[SCRIPT] Added successfully:', data);
        
        // Sync cart badge with latest data from API
        try {
            const cartData = await fetch('/api/cart', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }).then(r => r.json());
            
            if (cartData.items) {
                const totalQty = cartData.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                const badge = document.getElementById('cart-badge');
                if (badge) {
                    if (totalQty > 0) {
                        badge.textContent = totalQty;
                        badge.style.display = 'block';
                    } else {
                        badge.style.display = 'none';
                    }
                }
            }
        } catch (err) {
            console.error('Error updating badge:', err);
        }
        
        // Show success message
        alert('Produk berhasil ditambahkan ke keranjang!');
        
    } catch (error) {
        console.error('[SCRIPT] Error adding to cart:', error);
        alert('Gagal menambahkan ke keranjang: ' + error.message);
    }
}


function removeFromCart(productName) {
    state.cart = state.cart.filter(item => item.name !== productName);
    saveToStorage();
}

function updateQuantity(productName, quantity) {
    const item = state.cart.find(item => item.name === productName);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        }
    }
    saveToStorage();
}

// ===== NAVIGATION =====
function navigate(path) {
    window.location.hash = path;
}

function updateActiveNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentHash = window.location.hash;
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        
        if (currentHash === '' && href === '#/') {
            item.classList.add('active');
        } else if (currentHash.startsWith(href) && href !== '#/') {
            item.classList.add('active');
        }
    });
}

// ===== SIDEBAR =====
function openSidebar() {
    document.getElementById('sidebar-overlay').classList.add('active');
}

function closeSidebar() {
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// ===== PAGE TEMPLATES =====
function renderHome() {
    return `
        <header class="header">
            <div class="header-content">
                <button class="icon-btn" onclick="openSidebar()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
                <img src="https://via.placeholder.com/120x40/22c55e/ffffff?text=LumiTani" alt="LumiTani" class="header-logo">
                <button class="icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                </button>
            </div>
        </header>

        <!-- Hero Image -->
        <div style="position: relative;">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800" alt="Petani" style="width: 100%; height: 256px; object-fit: cover;">
            <div style="position: absolute; top: 12px; left: 12px; background: #ec4899; color: white; padding: 8px 16px; border-radius: 24px; font-size: 14px; transform: rotate(-12deg); box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Segar! 🌱
            </div>
        </div>

        <!-- Hero Banner -->
        <div class="hero-banner" style="margin-top: 12px;">
            <h3 class="hero-title">Langsung dari Petani Lokal</h3>
            <p class="hero-subtitle">100% Organik • Harga Transparan • Segar Setiap Hari</p>
            <a href="#/catalog/all" class="hero-btn">
                Belanja Sekarang
                <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </a>
        </div>

        <!-- Best Seller Section -->
        <div class="section bg-white" style="margin-top: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 class="section-title">
                    <svg style="width: 20px; height: 20px; fill: #facc15; stroke: #facc15;" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Best Seller
                </h3>
                <a href="#/catalog/bestseller" class="see-all-link">
                    Lihat Semua
                    <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </a>
            </div>
            <div class="scroll-container">
                ${products.slice(0, 5).map(product => `
                    <div class="scroll-item" style="width: 144px;">
                        <div class="product-card" onclick="navigate('#/product/${product.id}')">
                            <div class="product-image-container">
                                <img src="${product.image}" alt="${product.name}" class="card-image">
                                <div class="product-badge">⭐ Best</div>
                            </div>
                            <div class="product-info">
                                <p class="product-name">${product.name}</p>
                                <p class="product-price">${formatPrice(product.price)}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Categories Section -->
        <div class="section bg-white" style="margin-top: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 class="section-title">
                    🌾 Kategori Produk 🌾
                </h3>
                <a href="#/categories" class="see-all-link">
                    Lihat Semua
                    <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </a>
            </div>
            <div class="scroll-container">
                ${[
                    { name: 'Sayuran Hijau', icon: '🥬', color: '#dcfce7' },
                    { name: 'Buah-buahan', icon: '🍅', color: '#fee2e2' },
                    { name: 'Umbi-umbian', icon: '🥕', color: '#fed7aa' },
                    { name: 'Bumbu Dapur', icon: '🌿', color: '#d1fae5' },
                    { name: 'Paket Hemat', icon: '📦', color: '#fef3c7' }
                ].map(cat => `
                    <div class="scroll-item">
                        <div class="category-card">
                            <div class="category-icon" style="background: ${cat.color};" onclick="navigate('#/catalog/${encodeURIComponent(cat.name)}')">
                                ${cat.icon}
                            </div>
                            <p class="category-name">${cat.name}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCatalog(type = 'all') {
    let filteredProducts = products;
    let title = 'Semua Produk';

    if (type === 'bestseller') {
        title = 'Best Seller';
        filteredProducts = products.slice(0, 5);
    } else if (type !== 'all') {
        title = decodeURIComponent(type);
        filteredProducts = products.filter(p => p.category === decodeURIComponent(type));
    }

    return `
        <header class="header">
            <div class="header-content">
                <button class="icon-btn" onclick="history.back()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                </button>
                <h1 class="header-title">${title}</h1>
            </div>
        </header>

        <div class="section">
            ${filteredProducts.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                    </div>
                    <h3 class="empty-title">Produk Tidak Ditemukan</h3>
                    <p class="empty-text">Belum ada produk di kategori ini</p>
                </div>
            ` : `
                <div class="grid-2">
                    ${filteredProducts.map(product => `
                        <div class="product-card" onclick="navigate('#/product/${product.id}')">
                            <div class="product-image-container">
                                <img src="${product.image}" alt="${product.name}" class="card-image">
                            </div>
                            <div class="product-info">
                                <p class="product-name">${product.name}</p>
                                <p class="product-price">${formatPrice(product.price)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
}

function renderProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return `
            <div class="empty-state">
                <h3 class="empty-title">Produk tidak ditemukan</h3>
                <button class="btn btn-primary" onclick="navigate('#/catalog/all')">Kembali ke Katalog</button>
            </div>
        `;
    }

    return `
        <header class="header">
            <div class="header-content">
                <button class="icon-btn" onclick="history.back()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                </button>
                <h1 class="header-title">Detail Produk</h1>
            </div>
        </header>

        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 320px; object-fit: cover;">

        <div class="section">
            <!-- Product Info -->
            <div class="card mb-3">
                <div class="card-content">
                    <h1 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">${product.name}</h1>
                    <p style="font-size: 1.875rem; font-weight: 700; color: var(--color-green-600); margin-bottom: 4px;">${formatPrice(product.price)}</p>
                    <p style="font-size: 0.875rem; color: var(--color-gray-600);">${product.unit}</p>
                </div>
            </div>

            <!-- Product Details -->
            <div class="card mb-3">
                <div class="card-content">
                    <div class="grid-2" style="gap: 16px;">
                        <div style="display: flex; gap: 12px;">
                            <div style="background: #dcfce7; padding: 8px; border-radius: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                                <svg style="width: 20px; height: 20px; stroke: var(--color-green-600);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <div>
                                <p style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 4px;">Petani</p>
                                <p style="font-size: 0.875rem; font-weight: 600;">${product.farmer}</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <div style="background: #dbeafe; padding: 8px; border-radius: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                                <svg style="width: 20px; height: 20px; stroke: #2563eb;" viewBox="0 0 24 24" fill="none" stroke-width="2">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                </svg>
                            </div>
                            <div>
                                <p style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 4px;">Stok</p>
                                <p style="font-size: 0.875rem; font-weight: 600;">${product.stock} ${product.unit}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="card mb-3">
                <div class="card-content">
                    <h2 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 12px;">Deskripsi Produk</h2>
                    <p style="font-size: 0.875rem; color: var(--color-gray-700); line-height: 1.6;">
                        Produk organik segar yang ditanam tanpa pestisida kimia dan dipanen langsung dari kebun petani Desa Manud Jaya. 
                        Kualitas terjamin dan mendukung petani lokal.
                    </p>
                </div>
            </div>

            <!-- Benefits -->
            <div style="background: var(--color-green-50); border: 1px solid #bbf7d0; border-radius: var(--radius-xl); padding: 16px; margin-bottom: 16px;">
                <h3 style="font-size: 0.875rem; font-weight: 700; color: #166534; margin-bottom: 12px;">✨ Keunggulan Produk</h3>
                <ul style="list-style: none; padding: 0; font-size: 0.875rem; color: #166534;">
                    <li style="margin-bottom: 8px;">✓ 100% organik tanpa pestisida kimia</li>
                    <li style="margin-bottom: 8px;">✓ Dipanen segar langsung dari kebun</li>
                    <li style="margin-bottom: 8px;">✓ Mendukung petani lokal Desa Manud Jaya</li>
                    <li>✓ Harga transparan langsung dari petani</li>
                </ul>
            </div>
        </div>

        <!-- Action Buttons (Fixed) -->
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid var(--color-gray-200); padding: 16px; max-width: 768px; margin: 0 auto; z-index: 10;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button class="btn btn-secondary" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Keranjang
                </button>
                <button class="btn btn-primary" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}); navigate('#/checkout')">
                    <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    Beli Sekarang
                </button>
            </div>
        </div>
    `;
}

function renderCart() {
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return `
        <header class="header">
            <div class="header-content">
                <button class="icon-btn" onclick="history.back()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                </button>
                <h1 class="header-title">Keranjang</h1>
            </div>
        </header>

        <div class="section">
            ${state.cart.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                    </div>
                    <h3 class="empty-title">Keranjang Kosong</h3>
                    <p class="empty-text">Belum ada produk di keranjang</p>
                    <button class="btn btn-primary" onclick="navigate('#/catalog/all')">Belanja Sekarang</button>
                </div>
            ` : `
                <div style="margin-bottom: 100px;">
                    ${state.cart.map((item, index) => `
                        <div class="card mb-3">
                            <div class="card-content" style="display: flex; gap: 12px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                                <div style="flex: 1;">
                                    <h4 style="font-size: 0.875rem; margin-bottom: 4px;">${item.name}</h4>
                                    <p style="font-size: 0.875rem; font-weight: 600; color: var(--color-green-600); margin-bottom: 8px;">${formatPrice(item.price)}</p>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <button onclick="updateQuantity('${item.name}', ${item.quantity - 1}); renderPage()" style="width: 32px; height: 32px; border: 1px solid var(--color-gray-300); background: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                                        <span style="font-weight: 600; width: 32px; text-align: center;">${item.quantity}</span>
                                        <button onclick="updateQuantity('${item.name}', ${item.quantity + 1}); renderPage()" style="width: 32px; height: 32px; border: 1px solid var(--color-gray-300); background: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                                    </div>
                                </div>
                                <button onclick="removeFromCart('${item.name}'); renderPage()" style="padding: 8px; background: transparent; border: none; cursor: pointer; color: var(--color-red-600);">
                                    <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Total & Checkout (Fixed) -->
                <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid var(--color-gray-200); padding: 16px; max-width: 768px; margin: 0 auto; z-index: 10;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-size: 1.125rem; font-weight: 600;">Total</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--color-green-600);">${formatPrice(total)}</span>
                    </div>
                    <button class="btn btn-primary btn-block" onclick="navigate('#/checkout')">
                        Checkout
                    </button>
                </div>
            `}
        </div>
    `;
}

function renderProfile() {
    if (!state.isLoggedIn) {
        return `
            <header class="header">
                <div class="header-content">
                    <button class="icon-btn" onclick="navigate('#/')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                    </button>
                    <h1 class="header-title">Profil Saya</h1>
                </div>
            </header>
            <div class="empty-state">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <h3 class="empty-title">Silakan Login</h3>
                <p class="empty-text">Login untuk mengakses profil dan fitur lainnya</p>
                <button class="btn btn-primary" onclick="navigate('#/login')">Login Sekarang</button>
            </div>
        `;
    }

    return `
        <header class="header">
            <div class="header-content">
                <button class="icon-btn" onclick="navigate('#/')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                </button>
                <h1 class="header-title">Profil Saya</h1>
            </div>
        </header>

        <!-- Profile Header -->
        <div style="background: linear-gradient(135deg, var(--color-green-600), var(--color-green-700)); padding: 32px 24px; color: white;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <svg style="width: 40px; height: 40px; stroke: var(--color-green-600);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <div>
                    <h2 style="font-size: 1.25rem; margin-bottom: 4px;">${state.user?.name || 'User'}</h2>
                    <p style="font-size: 0.875rem; color: #dcfce7;">${state.user?.email || 'user@email.com'}</p>
                </div>
            </div>
        </div>

        <div class="section">
            <!-- Menu Items -->
            <div class="card mb-3">
                <a href="#/my-orders" style="display: flex; align-items: center; gap: 12px; padding: 16px; text-decoration: none; color: var(--color-gray-900); border-bottom: 1px solid var(--color-gray-100);">
                    <div style="width: 40px; height: 40px; background: var(--color-green-100); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <svg style="width: 20px; height: 20px; stroke: var(--color-green-600);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </div>
                    <span style="flex: 1;">Pesanan Saya</span>
                    <svg style="width: 20px; height: 20px; stroke: var(--color-gray-400);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </a>
                <a href="#/wishlist" style="display: flex; align-items: center; gap: 12px; padding: 16px; text-decoration: none; color: var(--color-gray-900); border-bottom: 1px solid var(--color-gray-100);">
                    <div style="width: 40px; height: 40px; background: var(--color-green-100); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <svg style="width: 20px; height: 20px; stroke: var(--color-green-600);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                    <span style="flex: 1;">Wishlist</span>
                    <svg style="width: 20px; height: 20px; stroke: var(--color-gray-400);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </a>
                <a href="#/addresses" style="display: flex; align-items: center; gap: 12px; padding: 16px; text-decoration: none; color: var(--color-gray-900); border-bottom: 1px solid var(--color-gray-100);">
                    <div style="width: 40px; height: 40px; background: var(--color-green-100); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <svg style="width: 20px; height: 20px; stroke: var(--color-green-600);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                    </div>
                    <span style="flex: 1;">Alamat Pengiriman</span>
                    <svg style="width: 20px; height: 20px; stroke: var(--color-gray-400);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </a>
                <a href="#/settings" style="display: flex; align-items: center; gap: 12px; padding: 16px; text-decoration: none; color: var(--color-gray-900);">
                    <div style="width: 40px; height: 40px; background: var(--color-green-100); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <svg style="width: 20px; height: 20px; stroke: var(--color-green-600);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 1v6m0 6v6m5.66-15.66l-4.24 4.24m-2.84 2.84l-4.24 4.24m15.66-5.66l-6 0m-6 0l-6 0m15.66 5.66l-4.24-4.24m-2.84-2.84l-4.24-4.24"/>
                        </svg>
                    </div>
                    <span style="flex: 1;">Pengaturan Akun</span>
                    <svg style="width: 20px; height: 20px; stroke: var(--color-gray-400);" viewBox="0 0 24 24" fill="none" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </a>
            </div>

            <!-- Logout Button -->
            <button class="btn btn-outline btn-block" onclick="logout()" style="color: var(--color-red-600); border-color: var(--color-red-200);">
                <svg style="width: 20px; height: 20px; stroke: currentColor;" viewBox="0 0 24 24" fill="none" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Keluar
            </button>
        </div>
    `;
}

function renderLogin() {
    return `
        <header class="header">
            <div class="header-content">
                <button class="icon-btn" onclick="history.back()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                </button>
                <h1 class="header-title">Login</h1>
            </div>
        </header>

        <div class="section">
            <div style="text-align: center; margin-bottom: 32px;">
                <img src="https://via.placeholder.com/120x40/22c55e/ffffff?text=LumiTani" alt="LumiTani" style="height: 48px; margin-bottom: 16px;">
                <h2 style="margin-bottom: 8px;">Selamat Datang!</h2>
                <p class="text-gray-600">Login untuk melanjutkan</p>
            </div>

            <form onsubmit="handleLogin(event)" style="max-width: 400px; margin: 0 auto;">
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="login-email" class="form-input" placeholder="email@contoh.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="login-password" class="form-input" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Login</button>
                <p style="text-align: center; margin-top: 16px; color: var(--color-gray-600);">
                    Belum punya akun? <a href="#/register" style="color: var(--color-green-600); text-decoration: none; font-weight: 600;">Daftar</a>
                </p>
            </form>
        </div>
    `;
}

// ===== AUTH FUNCTIONS =====
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simple validation (in production, verify against backend)
    state.isLoggedIn = true;
    state.user = { email, name: email.split('@')[0] };
    saveToStorage();
    showToast('Login berhasil!');
    navigate('#/profile');
}

function logout() {
    state.isLoggedIn = false;
    state.user = null;
    saveToStorage();
    showToast('Logout berhasil');
    navigate('#/');
}

// ===== ROUTER =====
function renderPage() {
    const app = document.getElementById('app');
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...params] = hash.split('/').filter(Boolean);

    showLoading();

    setTimeout(() => {
        let content = '';

        if (!path || path === '') {
            content = renderHome();
        } else if (path === 'catalog') {
            const type = params[0] || 'all';
            content = renderCatalog(type);
        } else if (path === 'product') {
            content = renderProductDetail(params[0]);
        } else if (path === 'cart') {
            content = renderCart();
        } else if (path === 'profile') {
            content = renderProfile();
        } else if (path === 'login') {
            content = renderLogin();
        } else {
            content = '<div class="empty-state"><h3>404 - Halaman tidak ditemukan</h3></div>';
        }

        app.innerHTML = content;
        hideLoading();
        updateActiveNav();
        window.scrollTo(0, 0);
    }, 100);
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderPage();

    // Sidebar
    document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'sidebar-overlay') {
            closeSidebar();
        }
    });

    // Sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Hash change
    window.addEventListener('hashchange', renderPage);
});
