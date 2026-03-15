const express = require("express");
const session = require("express-session");

const app = express();
const PORT = 3000;

/* ======================
   MIDDLEWARE
====================== */

// membaca file static (css, gambar)
app.use(express.static("public"));

// membaca input form
app.use(express.urlencoded({ extended: true }));

// SESSION LOGIN
app.use(session({
    secret: "lumitani-secret",
    resave: false,
    saveUninitialized: true
}));

// template engine
app.set("view engine", "ejs");


/* ======================
   ROUTES
====================== */

// landing page
app.get("/", (req, res) => {

    res.render("landing", {
        loggedIn: req.session.loggedIn || false
    });

});

// halaman login
app.get("/login", (req, res) => {
    res.render("login");
});

// proses login
app.post("/login", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    if (email === "admin@lumitani.com" && password === "admin123") {

        req.session.loggedIn = true;

        res.redirect("/");

    } else {

        res.send("Login gagal");

    }

});

// halaman katalog
app.get("/catalog", (req, res) => {
    res.render("catalog");
});


/* ======================
   SERVER
====================== */

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});