const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');
const todoRoutes = require('./todos');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files
app.use(express.static('.'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
