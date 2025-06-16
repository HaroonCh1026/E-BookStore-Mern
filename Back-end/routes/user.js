const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const authenticateToken = require('./userAuth');

// Secret key for JWT (ensure it is stored securely in env variables)
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// Validation middleware
const validateSignup = [
    body('username')
        .isLength({ min: 4 })
        .withMessage('Username must be at least 4 characters long')
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .trim(),
    body('address')
        .optional()
        .trim()
        .escape()
];

// Helper function to create JWT
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Signup Route
router.post('/signup', validateSignup, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, password, address } = req.body;

       
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email or Username already exists' });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({ username, email, password: hashedPassword, address, role: 'user' });
        await newUser.save();

        
        const token = generateToken(newUser);

        res.status(201).json({ success: true, message: 'Signup successful', id: newUser._id, role: newUser.role, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Signin Route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        const token = generateToken(user);

        res.status(200).json({ success: true, id: user._id, role: user.role, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Get User Information
router.get('/get-user-information', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Update User Address
router.put('/update-address', authenticateToken, async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ success: false, message: 'Address is required' });
        }

        const user = await User.findByIdAndUpdate(req.user.userId, { address }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Address updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

module.exports = router;
