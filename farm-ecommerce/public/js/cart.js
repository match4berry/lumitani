/**
 * Cart Page Functionality - API-driven with External Cart API
 * Calls external cart API at https://lumitani.elcyone.my.id/api/cart
 */

let cartApiUrl = 'http://localhost:5000/api/cart'; // Default local, will be replaced by config
let userId = null;

// Load configuration first (API URLs and user info)
async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    cartApiUrl = config.cartApiUrl;
    userId = config.userId;
    
    // Now load the cart
    if (userId) {
      loadCartFromAPI();
    } else {
      showNotLoggedIn();
    }
  } catch (error) {
    console.error('Error loading config:', error);
    showError('Gagal memuat konfigurasi');
  }
}

// Load cart items from external API when page loads
async function loadCartFromAPI() {
  try {
    // Call external cart API with user_id
    const response = await fetch(`${cartApiUrl}?user_id=${userId}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        showNotLoggedIn();
        return;
      }
      throw new Error(`Failed to fetch cart (${response.status})`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      renderCartItems(data.items);
      updateCartSummary(data.items);
    } else {
      showEmptyCart();
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    showError('Terjadi kesalahan saat memuat keranjang');
  }
}

// Display "not logged in" message
function showNotLoggedIn() {
  const container = document.getElementById('cartItemsContainer');
  container.innerHTML = `
    <div class="empty-cart">
      <p>Silakan <a href="/login">login terlebih dahulu</a></p>
    </div>
  `;
}

// Display generic error message
function showError(message) {
  const container = document.getElementById('cartItemsContainer');
  container.innerHTML = `
    <div class="empty-cart">
      <p>${message}</p>
      <p><a href="/catalog">Kembali ke katalog</a></p>
    </div>
  `;
}

// Display empty cart message
function showEmptyCart() {
  const container = document.getElementById('cartItemsContainer');
  container.innerHTML = `
    <div class="empty-cart">
      <p>Keranjang Anda kosong</p>
      <p><a href="/catalog">Mulai belanja di sini</a></p>
    </div>
  `;
}

// Render cart items to DOM from API response
function renderCartItems(items) {
  const container = document.getElementById('cartItemsContainer');
  
  if (items.length === 0) {
    showEmptyCart();
    return;
  }
  
  const itemsHTML = items.map(item => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    return `
      <div class="cart-item" data-product-id="${item.productId || item.product_id}">
        <div class="item-checkbox">
          <input type="checkbox" class="item-check" checked>
        </div>
        <div class="item-image">
          <img src="${item.photo_url || item.image || 'https://via.placeholder.com/100'}" alt="${item.name}">
        </div>
        <div class="item-info">
          <h4 class="item-name">${item.name || 'Produk'}</h4>
          <p class="item-price">Rp ${(item.price || 0).toLocaleString('id-ID')} / 250g</p>
        </div>
        <div class="item-quantity">
          <button class="qty-btn minus" onclick="decreaseQty(this, ${item.productId || item.product_id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <input type="number" class="qty-input" value="${item.quantity || 1}" min="1" 
                 onchange="updateQuantityAPI(this, ${item.productId || item.product_id})">
          <button class="qty-btn plus" onclick="increaseQty(this, ${item.productId || item.product_id})">
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
        <button class="item-delete" onclick="deleteFromCartAPI(${item.productId || item.product_id})">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');
  
  container.innerHTML = itemsHTML;
  initializeQtyButtons();
}

// Setup minus button styles
function initializeQtyButtons() {
  document.querySelectorAll('.qty-btn.minus').forEach(btn => {
    const input = btn.parentElement.querySelector('.qty-input');
    const qty = parseInt(input.value);
    updateMinusButtonStyle(btn, qty);
  });
}

// Update minus button appearance based on quantity
function updateMinusButtonStyle(btn, qty = null) {
  const input = btn.parentElement.querySelector('.qty-input');
  const quantity = qty || parseInt(input.value);
  
  if (quantity === 1) {
    btn.style.background = '#d1d5db';
    btn.style.cursor = 'not-allowed';
  } else {
    btn.style.background = '#16a34a';
    btn.style.cursor = 'pointer';
  }
}

// Decrease quantity (UI only, API called via input onchange)
function decreaseQty(btn, productId) {
  const input = btn.parentElement.querySelector('.qty-input');
  let value = parseInt(input.value);
  if (value > 1) {
    input.value = value - 1;
    updateItemTotal(btn);
    updateMinusButtonStyle(btn, value - 1);
  }
}

// Increase quantity (UI only, API called via input onchange)
function increaseQty(btn, productId) {
  const input = btn.parentElement.querySelector('.qty-input');
  let value = parseInt(input.value);
  input.value = value + 1;
  updateItemTotal(btn);
  updateMinusButtonStyle(btn, value + 1);
}

// Update item total price display
function updateItemTotal(btn) {
  const cartItem = btn.closest('.cart-item');
  const priceText = cartItem.querySelector('.item-price').textContent;
  const priceMatch = priceText.match(/\d+/);
  const price = priceMatch ? parseInt(priceMatch[0]) : 0;
  const quantity = parseInt(cartItem.querySelector('.qty-input').value) || 1;
  const total = price * quantity;

  cartItem.querySelector('.total-price').textContent = `Rp ${total.toLocaleString('id-ID')}`;
  updateCartSummaryFromDOM();
}

// Calculate and update totals from current DOM state
function updateCartSummaryFromDOM() {
  const prices = Array.from(document.querySelectorAll('.total-price')).map(el => {
    const text = el.textContent;
    return parseInt(text.replace(/\D/g, '')) || 0;
  });

  const total = prices.reduce((sum, price) => sum + price, 0);
  const itemCount = document.querySelectorAll('.cart-item').length;

  document.querySelector('.total-amount').textContent = `Rp ${total.toLocaleString('id-ID')}`;
  document.querySelector('.total-items').textContent = `sub total ${itemCount} item`;
}

// Update totals from items array
function updateCartSummary(items) {
  let totalAmount = 0;
  let totalItems = 0;
  
  items.forEach(item => {
    totalAmount += ((item.price || 0) * (item.quantity || 1));
    totalItems += (item.quantity || 1);
  });
  
  document.querySelector('.total-amount').textContent = `Rp ${totalAmount.toLocaleString('id-ID')}`;
  document.querySelector('.total-items').textContent = `sub total ${totalItems} item`;
}

// Call external API to update item quantity
async function updateQuantityAPI(input, productId) {
  const quantity = parseInt(input.value);
  
  if (quantity < 1) {
    input.value = 1;
    return;
  }
  
  try {
    const response = await fetch(`${cartApiUrl}/${productId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
      },
      body: JSON.stringify({ quantity, user_id: userId }),
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Failed to update quantity');
    
    updateItemTotal(input.closest('.item-quantity').querySelector('.qty-btn'));
  } catch (error) {
    console.error('Error updating quantity:', error);
    alert('Gagal mengubah jumlah produk');
    loadCartFromAPI();
  }
}

// Call external API to delete item from cart
async function deleteFromCartAPI(productId) {
  if (!confirm('Yakin ingin menghapus item ini?')) return;
  
  try {
    const response = await fetch(`${cartApiUrl}/${productId}`, { 
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
      },
      body: JSON.stringify({ user_id: userId }),
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error('Failed to delete item');
    
    loadCartFromAPI();
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Gagal menghapus item');
  }
}

// Navigate to checkout with selected items
function proceedToCheckout() {
  const cartItems = document.querySelectorAll('.cart-item');
  
  if (cartItems.length === 0) {
    alert('Keranjang Anda kosong!');
    return;
  }
  
  const checkedItems = Array.from(document.querySelectorAll('.item-check:checked')).map(check => 
    check.closest('.cart-item')
  );
  
  if (checkedItems.length === 0) {
    alert('Pilih produk yang ingin dipesan');
    return;
  }
  
  const selectedItems = checkedItems.map(item => ({
    name: item.querySelector('.item-name').textContent,
    price: parseInt(item.querySelector('.item-price').textContent.match(/\d+/)[0]),
    quantity: parseInt(item.querySelector('.qty-input').value),
    image: item.querySelector('.item-image img').src
  }));
  
  localStorage.setItem('checkout_items', JSON.stringify(selectedItems));
  window.location.href = '/checkout';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadConfig();
  
  const orderBtn = document.querySelector('.btn-order-now');
  if (orderBtn) {
    orderBtn.addEventListener('click', function(e) {
      e.preventDefault();
      proceedToCheckout();
    });
  }
});
