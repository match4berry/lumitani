const express = require("express");

const app = express();
const PORT = 3000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// template engine
app.set("view engine", "ejs");

// import order routes
const orderRoutes = require("./routes/order");
app.use(orderRoutes);

// endpoint test
app.get("/", (req, res) => {
    res.send(`
        <h1>Order Service</h1>
        <a href="/checkout">Checkout</a>
    `);
});

// run server
app.listen(PORT, () => {
    console.log("Server berjalan di http://localhost:3000");
});