const express = require("express");
const router = express.Router();
const fs = require("fs");

// halaman checkout
router.get("/checkout", (req, res) => {

    const product = {
        name: "Sayur Organik",
        price: 10000,
        qty: 2
    };

    const total = product.price * product.qty;

    res.render("checkout", { product, total });

});

// proses order
router.post('/order', (req, res) => {
    const { name, phone, address, city, postal, note, payment } = req.body;

    const order = {
        id: 'ORD-' + Date.now(),
        name,
        phone,
        address,
        city,
        postal,
        note,
        payment,
        items: [
            { name: "Bayam Organik", price: 10000, qty: 1 },
            { name: "Kangkung Segar", price: 10000, qty: 1 }
        ],
        total: 20000,
        status: "Menunggu Diproses",
        createdAt: new Date()
    };

    // ⬇️ INI YANG PENTING
    res.render("order-success", { order });
});

module.exports = router;