// Product detail page functionality

// Change main image when thumbnail is clicked
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const images = document.querySelectorAll('.thumbnail');
    
    // Remove active class from all thumbnails
    images.forEach(img => img.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');
    
    // Update main image
    const newSrc = thumbnail.querySelector('img').src;
    mainImage.src = newSrc;
}

// Add to cart via Local Proxy API
async function addToCart(productId) {
    try {
        console.log('[PRODUCT] Checking login status...');
        
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
        
        console.log('[PRODUCT] Adding to cart:', { productId });
        
        // Call local proxy cart API - just send product_id and quantity
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
        console.log('[PRODUCT] Added successfully:', data);
        
        // Show success message
        alert('Produk berhasil ditambahkan ke keranjang!');
        
    } catch (error) {
        console.error('[PRODUCT] Error adding to cart:', error);
        alert('Gagal menambahkan ke keranjang: ' + error.message);
    }
}

// Update cart badge globally
function updateCartBadgeGlobal() {
    try {
        const cartBadge = document.getElementById('cart-badge');
        if (!cartBadge) return;
        
        const cart = JSON.parse(localStorage.getItem('lumitani_cart')) || [];
        const qty = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
        
        if (qty > 0) {
            cartBadge.textContent = qty;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    } catch (e) {
        console.error('Error updating cart badge:', e);
    }
}

// Order now
function orderNow(productId) {
    alert('Mengarahkan ke halaman checkout...');
    // In a real app, this would redirect to checkout
    // window.location.href = `/checkout?productId=${productId}`;
    console.log('Ordering product', productId);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth interactions
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            changeImage(this);
        });
    });
});
