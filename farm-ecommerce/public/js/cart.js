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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Save/sync initial cart items to localStorage
    saveCartToStorage();
    
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
