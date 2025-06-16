const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');  
const User = require('../models/user');
const authenticateToken = require('./userAuth');

router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body; 
        const id = req.user.userId;   

        console.log('User ID:', id);
        console.log('Book ID:', bookid);

       
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
            return res.status(400).json({ status: "Error", message: "Invalid book ID" });
        }

        
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }

        console.log('User Cart:', userData.cart);

     
        const isBookInCart = userData.cart.some(item => item.toString() === bookid);
        if (isBookInCart) {
            return res.json({ status: "Success", message: "Book is already in cart" });
        }

        await User.findByIdAndUpdate(id, { $push: { cart: bookid } });

        return res.json({ status: "Success", message: "Book added to cart" });

    } catch (error) {
        console.error("Error adding book to cart:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// remove book from cart
router.put("/remove-from-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body;  
        const id = req.user.userId;   

        console.log('User ID:', id);
        console.log('Book ID:', bookid);

      
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
            return res.status(400).json({ status: "Error", message: "Invalid book ID" });
        }

       
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }

        console.log('User Cart:', userData.cart);

        
        const isBookInCart = userData.cart.some(item => item.toString() === bookid);
        if (!isBookInCart) {
            return res.json({ status: "Success", message: "Book is not in cart" });
        }

       
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });

        return res.json({ status: "Success", message: "Book removed from cart" });

    } catch (error) {
        console.error("Error removing book from cart:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// get cart of particular user
router.get("/get-cart", authenticateToken, async (req, res) => {
    try {
        const id = req.user.userId; 

       
        const userData = await User.findById(id).populate('cart');
        if (!userData) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }

        console.log('User Cart:', userData.cart);

       
        const cartData = userData.cart;

        return res.json({ status: "Success", message: "Cart data", cart: cartData });

    } catch (error) {
        console.error("Error getting cart data:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}); 

module.exports = router;
