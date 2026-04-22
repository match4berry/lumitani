const express = require("express");
const router = express.Router();
const fs = require("fs");

// halaman checkout - fetch cart data from client-side API
router.get("/checkout", (req, res) => {
    // Check if user is logged in
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    
    // Just render checkout page - client will fetch cart data from API
    res.render("checkout", { items: [], total: 0 });
});

// halaman order confirmation - show order review before final submission
router.post('/order', (req, res) => {
    const { name, phone, address, city, postal, note, payment, items, total } = req.body;

    // Parse items if it's a string (form submission)
    let orderItems = [];
    let orderTotal = 0;

    if (typeof items === 'string') {
        try {
            orderItems = JSON.parse(items);
        } catch (e) {
            orderItems = [];
        }
    } else {
        orderItems = items || [];
    }

    if (typeof total === 'string') {
        orderTotal = parseInt(total.replace(/\D/g, ''));
    } else {
        orderTotal = total || 0;
    }

    // Payment method mapping
    const paymentMap = {
        'bca': 'Transfer Bank BCA',
        'mandiri': 'Transfer Bank Mandiri',
        'bni': 'Transfer Bank BNI',
        'dana': 'E-Wallet DANA',
        'ovo': 'E-Wallet OVO',
        'gopay': 'E-Wallet GoPay',
        'cod': 'Bayar di Tempat (COD)'
    };

    const paymentLabel = paymentMap[payment] || payment;

    // Store order data in session for confirmation
    req.session.orderData = {
        name,
        phone,
        address,
        city,
        postal,
        note,
        payment,
        paymentLabel,
        items: orderItems,
        total: orderTotal
    };

    console.log('[ORDER] Showing confirmation page with data:', req.session.orderData);

    // Render order confirmation page
    res.render("order-confirmation", { 
        orderData: req.session.orderData
    });
});

// confirm and process order - final submission
router.post('/order/confirm', async (req, res) => {
    const { name, phone, address, city, postal, note, payment, items, total } = req.body;

    // Parse items if it's a string (form submission)
    let orderItems = [];
    let orderTotal = 0;

    if (typeof items === 'string') {
        try {
            orderItems = JSON.parse(items);
        } catch (e) {
            orderItems = [];
        }
    } else {
        orderItems = items || [];
    }

    if (typeof total === 'string') {
        orderTotal = parseInt(total.replace(/\D/g, ''));
    } else {
        orderTotal = total || 0;
    }

    // Map payment value to backend format
    const paymentMethodMap = {
        'bca': 'Transfer Bank BCA',
        'mandiri': 'Transfer Bank Mandiri',
        'bni': 'Transfer Bank BNI',
        'dana': 'E-Wallet DANA',
        'ovo': 'E-Wallet OVO',
        'gopay': 'E-Wallet GoPay',
        'cod': 'Bayar di Tempat (COD)'
    };

    const metode_pembayaran = paymentMethodMap[payment] || payment;

    // Create order object for local storage
    const localOrder = {
        id: 'ORD-' + Date.now(),
        name,
        phone,
        address,
        city,
        postal,
        note,
        payment,
        items: orderItems.length > 0 ? orderItems : [],
        total: orderTotal > 0 ? orderTotal : 0,
        status: "Menunggu Diproses",
        createdAt: new Date()
    };

    // Save order to local file for backup
    try {
        const ordersFilePath = require('path').join(__dirname, '../../data/orders.json');
        const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
        const orders = JSON.parse(ordersData);
        orders.push(localOrder);
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
        console.log('[ORDER] Order saved locally:', localOrder.id);
    } catch (e) {
        console.error("[ORDER] Error saving local order:", e);
    }

    // Try to send to backend API
    try {
        console.log('[ORDER] Sending order to backend API at http://localhost:8000/api/orders');
        
        // Transform items to backend format
        // Allow items without product_id if they don't have it (will be sent as null)
        const backendItems = orderItems.map(item => ({
            product_id: item.product_id || null, // Will be NULL if not from cart
            quantity: item.quantity || 1,
            unit_price: item.price || 0,
            subtotal: (item.price || 0) * (item.quantity || 1)
        }));
        // NOTE: Don't filter - send all items, even if product_id is null
        // Backend will handle items without product_id

        const backendOrderData = {
            customer_name: name,
            items: backendItems.length > 0 ? backendItems : [],
            user_id: req.session.userId || null,
            pengiriman: address,
            no_hp: phone,
            metode_pembayaran: metode_pembayaran
        };

        console.log('[ORDER] Backend order data:', JSON.stringify(backendOrderData, null, 2));

        const apiResponse = await fetch('http://localhost:8000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.userToken || ''}`
            },
            body: JSON.stringify(backendOrderData)
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.warn('[ORDER] Backend API error (non-critical):', errorData);
            // Don't throw - continue with local order
        } else {
            const backendOrder = await apiResponse.json();
            console.log('[ORDER] Order sent to backend successfully:', backendOrder.id || backendOrder.order_code);
        }
    } catch (err) {
        console.error('[ORDER] Error sending to backend API (non-critical):', err);
        // Don't throw - user sees redirect anyway since local order was saved
    }

    // Always redirect to order history after saving locally
    console.log('[ORDER] Redirecting to /order-history?new=true');
    return res.redirect('/order-history?new=true');
});

module.exports = router;

