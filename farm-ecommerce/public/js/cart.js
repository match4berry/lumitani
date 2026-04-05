// Cart page functionality

// Filter cart items by category
function filterCart(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartItems = document.querySelectorAll('.cart-item');

    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide items based on category
    // For demo purposes, all items are shown
    // In real app, this would filter by product category
}

// Decrease quantity
function decreaseQty(btn) {
    const input = btn.parentElement.querySelector('.qty-input');
    let value = parseInt(input.value);
    if (value > 1) {
        input.value = value - 1;
        updateItemTotal(btn);
        updateMinusButtonStyle(btn);
        saveCartToStorage();
    }
}

// Increase quantity
function increaseQty(btn) {
    const input = btn.parentElement.querySelector('.qty-input');
    let value = parseInt(input.value);
    input.value = value + 1;
    updateItemTotal(btn);
    updateMinusButtonStyle(btn);
    saveCartToStorage();
}

// Update minus button style based on quantity
function updateMinusButtonStyle(btn) {
    const quantityDiv = btn.closest('.item-quantity');
    const minusBtn = quantityDiv.querySelector('.qty-btn.minus');
    const input = quantityDiv.querySelector('.qty-input');
    const qty = parseInt(input.value);
    
    if (qty === 1) {
        minusBtn.style.background = '#d1d5db';
        minusBtn.style.cursor = 'not-allowed';
    } else {
        minusBtn.style.background = '#16a34a';
        minusBtn.style.cursor = 'pointer';
    }
}

// Update item total price
function updateItemTotal(btn) {
    const cartItem = btn.closest('.cart-item');
    const priceText = cartItem.querySelector('.item-price').textContent;
    const price = parseInt(priceText.match(/\d+/)[0]);
    const quantity = parseInt(cartItem.querySelector('.qty-input').value);
    const total = price * quantity;

    cartItem.querySelector('.total-price').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    updateCartTotal();
    updateCartBadge();
}

// Delete item from cart
function deleteItem(btn) {
    if (confirm('Yakin ingin menghapus item ini?')) {
        const cartItem = btn.closest('.cart-item');
        const itemName = cartItem.querySelector('.item-name').textContent;
        
        cartItem.remove();
        updateCartTotal();
        updateCartBadge();
        saveCartToStorage();

        // Check if cart is empty
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            alert('Keranjang Anda kosong');
        }
    }
}

// Update cart total
function updateCartTotal() {
    const prices = Array.from(document.querySelectorAll('.total-price')).map(el => {
        const text = el.textContent;
        return parseInt(text.replace(/\D/g, ''));
    });

    const total = prices.reduce((sum, price) => sum + price, 0);
    const itemCount = document.querySelectorAll('.cart-item').length;

    document.querySelector('.total-amount').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    document.querySelector('.total-items').textContent = `sub total ${itemCount} item`;
}

// Update cart badge count
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    
    // Read from localStorage (state.cart) to ensure consistency across all pages
    // This is the same approach used in script.js
    try {
        const cart = JSON.parse(localStorage.getItem('lumitani_cart')) || [];
        const qty = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        if (qty > 0) {
            cartBadge.textContent = qty;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    } catch (e) {
        // Fallback: if localStorage fails, count DOM elements
        const qty = Array.from(document.querySelectorAll('.qty-input')).reduce((sum, input) => {
            return sum + parseInt(input.value || 0);
        }, 0);
        
        if (qty > 0) {
            cartBadge.textContent = qty;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Save cart items from DOM to localStorage
function saveCartToStorage() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cart = [];
    
    cartItems.forEach(item => {
        const name = item.querySelector('.item-name').textContent;
        const priceText = item.querySelector('.item-price').textContent;
        const price = parseInt(priceText.match(/\d+/)[0]);
        const quantity = parseInt(item.querySelector('.qty-input').value);
        
        cart.push({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            price: price,
            quantity: quantity,
            image: item.querySelector('.item-image img').src
        });
    });
    
    localStorage.setItem('lumitani_cart', JSON.stringify(cart));
}

// Proceed to checkout from cart - "Pesan Sekarang"
function proceedToCheckout() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartItems.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    
    const items = [];
    let total = 0;
    
    cartItems.forEach(item => {
        const name = item.querySelector('.item-name').textContent;
        const priceText = item.querySelector('.item-price').textContent;
        const price = parseInt(priceText.match(/\d+/)[0]);
        const quantity = parseInt(item.querySelector('.qty-input').value);
        
        items.push({
            name: name,
            price: price,
            quantity: quantity
        });
        
        total += price * quantity;
    });
    
    // Redirect to checkout with items as query parameter
    const productsParam = encodeURIComponent(JSON.stringify(items));
    window.location.href = `/checkout?products=${productsParam}`;
}

// Load cart items from localStorage and render them
function loadCartFromStorage() {
    try {
        const cart = JSON.parse(localStorage.getItem('lumitani_cart')) || [];
        const cartItemsContainer = document.querySelector('.cart-items');
        
        // If cart is empty from localStorage, keep mockup items (for first-time users)
        // Otherwise, clear and load from localStorage
        if (cart.length > 0) {
            // Clear all hardcoded mockup items
            cartItemsContainer.innerHTML = '';
            
            // Render items from localStorage
            cart.forEach(item => {
                const itemPrice = parseInt(item.price) || 0;
                const itemQty = parseInt(item.quantity) || 1;
                const itemTotal = itemPrice * itemQty;
                
                const cartItemHTML = `
                    <div class="cart-item">
                        <div class="item-checkbox">
                            <input type="checkbox" class="item-check" checked>
                        </div>
                        <div class="item-image">
                            <img src="${item.image || '/images/default.jpg'}" alt="${item.name}">
                        </div>
                        <div class="item-info">
                            <h4 class="item-name">${item.name}</h4>
                            <p class="item-price">Rp ${itemPrice.toLocaleString('id-ID')} / 250g</p>
                        </div>
                        <div class="item-quantity">
                            <button class="qty-btn minus" onclick="decreaseQty(this)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                            <input type="number" class="qty-input" value="${itemQty}" min="1">
                            <button class="qty-btn plus" onclick="increaseQty(this)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                        </div>
                        <div class="item-total">
                            <div class="total-label">Total</div>
                            <div class="total-price">Rp ${itemTotal.toLocaleString('id-ID')}</div>
                        </div>
                        <button class="item-delete" onclick="deleteItem(this)">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
            
            // Re-initialize minus button styles for loaded items
            const qtyBtns = document.querySelectorAll('.qty-btn.minus');
            qtyBtns.forEach(btn => {
                const input = btn.parentElement.querySelector('.qty-input');
                const qty = parseInt(input.value);
                if (qty === 1) {
                    btn.style.background = '#d1d5db';
                    btn.style.cursor = 'not-allowed';
                }
            });
        }
    } catch (e) {
        console.error('Error loading cart from localStorage:', e);
    }
}

// Add product to cart from catalog page
function addToCart(productId, productName, productPrice, productImage) {
    try {
        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('lumitani_cart')) || [];
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Increment quantity if item already in cart
            existingItem.quantity += 1;
        } else {
            // Add new item to cart
            cart.push({
                id: productId,
                name: productName,
                price: parseInt(productPrice),
                quantity: 1,
                image: productImage || '/images/default.jpg'
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('lumitani_cart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadgeGlobal();
        
        // Show success message
        alert('Produk berhasil ditambahkan ke keranjang!');
        
    } catch (e) {
        console.error('Error adding to cart:', e);
        alert('Gagal menambahkan ke keranjang');
    }
}

// Update cart badge globally (used from any page)
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage first
    loadCartFromStorage();
    
    // Initialize cart total on load
    updateCartTotal();
    updateCartBadge();

    // Initialize minus button styles for each item
    const qtyBtns = document.querySelectorAll('.qty-btn.minus');
    qtyBtns.forEach(btn => {
        const input = btn.parentElement.querySelector('.qty-input');
        const qty = parseInt(input.value);
        if (qty === 1) {
            btn.style.background = '#d1d5db';
        } else {
            btn.style.background = '#16a34a';
        }
    });

    // Add order now button functionality
    const orderBtn = document.querySelector('.btn-order-now');
    if (orderBtn) {
        orderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            proceedToCheckout();
        });
    }
});
