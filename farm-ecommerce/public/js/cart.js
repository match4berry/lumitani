// Cart page functionality

// Filter cart items by category
function filterCart(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartItems = document.querySelectorAll('.cart-item-group');

    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter items
    if (category === 'all') {
        cartItems.forEach(item => item.style.display = 'block');
    } else {
        cartItems.forEach(item => {
            item.style.display = 'block'; // Show all farmers for now
        });
    }
}

// Decrease quantity
function decreaseQty(btn) {
    const input = btn.parentElement.querySelector('.qty-input');
    let value = parseInt(input.value);
    if (value > 1) {
        input.value = value - 1;
        updateItemTotal(btn);
    }
}

// Increase quantity
function increaseQty(btn) {
    const input = btn.parentElement.querySelector('.qty-input');
    let value = parseInt(input.value);
    input.value = value + 1;
    updateItemTotal(btn);
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
}

// Delete item from cart
function deleteItem(btn) {
    if (confirm('Yakin ingin menghapus item ini?')) {
        btn.closest('.cart-item').remove();
        updateCartTotal();

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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart total on load
    updateCartTotal();

    // Add order now button functionality
    const orderBtn = document.querySelector('.btn-order-now');
    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            alert('Mengarahkan ke halaman checkout...');
            // In a real app: window.location.href = '/checkout';
        });
    }
});
