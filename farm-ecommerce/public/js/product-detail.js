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

// Add to cart
function addToCart(productId) {
    alert('Produk telah ditambahkan ke keranjang!');
    console.log('Added product', productId, 'to cart');
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
