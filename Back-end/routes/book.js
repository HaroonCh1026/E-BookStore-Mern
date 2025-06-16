const router = require('express').Router();
const Book = require('../models/books');
const authenticateToken = require('./userAuth');

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Only admins can perform this action.' });
    }
    next();
};

// Add a new book (Admin Only)
router.post('/add-book/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { url, title, author, price, description, language } = req.body;

        if (!url || !title || !author || !price || !description || !language) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ success: false, message: 'Invalid price value. It must be a positive number.' });
        }


        const newBook = new Book({ url, title, author, price: parsedPrice, description, language });
        const createdBook = await newBook.save();

        res.status(201).json({ success: true, message: 'Book added successfully', book: createdBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});
const mongoose = require('mongoose');
// Update a book (Admin Only)
router.put('/update-book', authenticateToken, isAdmin, async (req, res) => {
    try {
 
        console.log('Request headers:', req.headers);

        const { bookid } = req.headers;

     
        if (!bookid) {
            console.error('Book ID is missing in the request headers');
            return res.status(400).json({ success: false, message: 'Book ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(bookid)) {
            console.error('Invalid Book ID:', bookid);
            return res.status(400).json({ success: false, message: 'Invalid Book ID' });
        }

 
        console.log('Request body:', req.body);


        const updatedBook = await Book.findByIdAndUpdate(
            bookid,
            {
                url: req.body.url,
                title: req.body.title,
                author: req.body.author,
                price: req.body.price,
                description: req.body.description,
                language: req.body.language,
            },
            { new: true } 
        );

        
        if (!updatedBook) {
            console.error('Book not found with ID:', bookId);
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.status(200).json({ success: true, message: 'Book updated successfully', book: updatedBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});
// Delete a book (Admin Only)
router.delete('/delete-book', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { bookid } = req.headers; 

        if (!bookid) {
            console.error('Book ID is missing in the request headers');
            return res.status(400).json({ success: false, message: 'Book ID is required' });
        }

        
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
            console.error('Invalid Book ID:', bookid);
            return res.status(400).json({ success: false, message: 'Invalid Book ID' });
        }


        const deletedBook = await Book.findByIdAndDelete(bookid);

        if (!deletedBook) {
            console.error('Book not found with ID:', bookid);
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.status(200).json({ success: true, message: 'Book deleted successfully', book: deletedBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Get all books
router.get('/get-all-books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

//get recent added books limit 4
router.get('/get-recent-books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        res.status(200).json({ success: true, books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

router.get('/get-book-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params;

       
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid book ID' });
        }

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        res.status(200).json({ success: true, book });
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});


module.exports = router;