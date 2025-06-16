const router = require('express').Router();
const User = require('../models/user');
const authenticateToken = require('./userAuth');
const mongoose = require('mongoose');

// Add book to favourites
router.put('/add-book-to-favourite', authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body;

        if (!bookid) {
            return res.status(400).json({ message: 'Book ID is required' });
        }


        if (!mongoose.Types.ObjectId.isValid(bookid)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const bookObjectId = new mongoose.Types.ObjectId(bookid);
        const id = req.user.userId;

    
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isBookFavourite = userData.favourites.some(favBookId => favBookId.equals(bookObjectId));

        if (isBookFavourite) {
            return res.status(400).json({ message: 'Book already in favourites' });
        }

       
        await User.findByIdAndUpdate(id, { $push: { favourites: bookObjectId } });

        res.status(200).json({ message: 'Book added to favourites' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Remove book from favourites
router.put('/remove-book-from-favourite', authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body;

        if (!bookid) {
            return res.status(400).json({ message: 'Book ID is required' });
        }

      
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const bookObjectId = new mongoose.Types.ObjectId(bookid);
        const id = req.user.userId;

     
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }


        const isBookFavourite = userData.favourites.some(favBookId => favBookId.equals(bookObjectId));

        if (!isBookFavourite) {
            return res.status(400).json({ message: 'Book not in favourites' });
        }

        await User.findByIdAndUpdate(id, { $pull: { favourites: bookObjectId } });

        res.status(200).json({ message: 'Book removed from favourites' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/get-favourite-books', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; 

        console.log('Fetching favourite books for user:', userId);

       
        const userData = await User.findById(userId).populate('favourites');

        if (!userData) {
            console.error('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User favourites:', userData.favourites);

        res.status(200).json({ message: 'Favourite books', books: userData.favourites });

    } catch (err) {
        console.error('Error fetching favourite books:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;

