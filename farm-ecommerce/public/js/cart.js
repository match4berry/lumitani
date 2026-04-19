// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCart();

    function loadCart() {
        const cartContent = document.getElementById('cartContent');

        fetch('/cart')
            .then(response => response.text())
            .then(html => {
                // Cart data would typically come from a separate API
                // For now, we'll show a message
                renderCartUI();
            });
    }

    function renderCartUI() {
        const cartContent = document.getElementById('cartContent');
        
        // This would typically fetch from /api/cart endpoint
        // Create a simple UI for now
        cartContent.innerHTML = `
            <div class="cart-container">
                <p style="text-align: center; color: #999; padding: 40px;">
                    Keranjang Anda sedang kosong.<br>
                    <a href="/catalog" style="color: #2d5016; text-decoration: none; font-weight: 600;">
                        Lanjutkan Belanja
                    </a>
                </p>
            </div>
        `;
    }
});
