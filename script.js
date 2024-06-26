// server.js

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Sample data store for submitted names
let submittedNames = [];

// Authentication middleware
function requireLogin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

// Routes
app.get('/', requireLogin, (req, res) => {
    res.render('admin', { submittedNames }); // Pass submittedNames to admin.html
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check credentials (this is a basic example, replace with secure authentication)
    if (username === 'admin' && password === 'password') {
        req.session.admin = true;
        return res.redirect('/');
    } else {
        return res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    });
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name } = req.body;

    // Store submitted name
    submittedNames.push(name);

    // Redirect back to admin page
    res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
