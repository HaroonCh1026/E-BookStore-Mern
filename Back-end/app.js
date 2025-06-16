const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Importing user.js
const user = require('./routes/user');
// Importing book.js
const Books = require('./routes/book');
// Importing Favourite.js
const Favourite = require('./routes/favourtie');
//importing cart.js
const cart = require('./routes/cart');
//importing order.js
const order = require('./routes/order');
// Importing connection.js
const connectDB = require('./connection/connection');

// Connecting to database
connectDB().catch((err) => console.log(err));

// Cors
app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', user);
app.use('/api/v1', Books);
app.use('/api/v1', Favourite);
app.use('/api/v1', cart);
app.use('/api/v1', order);

// Port
const port = process.env.PORT || 4000;

// Creating port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});