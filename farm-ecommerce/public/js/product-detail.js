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

// Add to cart via External API
async function addToCart(productId) {
    try {
        // Get config (cart API URL and user_id)
        const configRes = await fetch('/api/config');
        const config = await configRes.json();
        
        if (!config.userId) {
            alert('Silakan login terlebih dahulu');
            window.location.href = '/login';
            return;
        }
        
        // Get product data from DOM
        const productTitle = document.querySelector('.product-title').textContent.trim().replace('Premium', '').trim();
        const priceText = document.querySelector('.price-text').textContent;
        const priceMatch = priceText.match(/\d+/g);
        let priceValue = 0;
        
        if (priceMatch) {
            // Join all numbers and parse (e.g., "Rp 10.000" -> "10000")
            priceValue = parseInt(priceMatch.join(''));
        }
        
        const productImage = document.getElementById('mainImage').src;
        
        console.log("${config.cartApiUrl}/add")
        // Call external cart API
        const response = await fetch(`${config.cartApiUrl}/add`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.userId}`
            },
            body: JSON.stringify({
                user_id: config.userId,
                productId,
                quantity: 1,
                name: productTitle,
                price: priceValue,
                photo_url: productImage
            }),
            credentials: 'include'
        });
        
        if (response.status === 401) {
            alert('Silakan login terlebih dahulu');
            window.location.href = '/login';
            return;
        }
        
        if (!response.ok) throw new Error('Failed to add to cart');
        
        const data = await response.json();
        
        // Show success message
        alert('Produk berhasil ditambahkan ke keranjang!');
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Gagal menambahkan ke keranjang');
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
