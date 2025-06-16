const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    books: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true
    }],
    status: {
        type: String,
        enum: ['Pending', 'Ordered placed', 'Out for delivery', 'Delivered', 'Cancelled'],  
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('orders', orderSchema);
