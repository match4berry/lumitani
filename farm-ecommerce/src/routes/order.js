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

// proses order
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

    const order = {
        id: 'ORD-' + Date.now(),
        name,
        phone,
        address,
        city,
        postal,
        note,
        payment,
        items: orderItems.length > 0 ? orderItems : [
            { name: "Bayam Organik", price: 10000, quantity: 1 },
            { name: "Kangkung Segar", price: 10000, quantity: 1 }
        ],
        total: orderTotal > 0 ? orderTotal : 20000,
        status: "Menunggu Diproses",
        createdAt: new Date()
    };

    // Save order to file
    try {
        const ordersFilePath = require('path').join(__dirname, '../../data/orders.json');
        const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
        const orders = JSON.parse(ordersData);
        orders.push(order);
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    } catch (e) {
        console.error("Error saving order:", e);
    }

    res.render("order-success", { order });
});

module.exports = router;

