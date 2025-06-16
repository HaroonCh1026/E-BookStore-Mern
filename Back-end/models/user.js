const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true        
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/anything?s=200&d=mm'
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    favourites:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    }],
    cart :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'    
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }],
},{timestamps: true}); 

module.exports = mongoose.model('User', userSchema);     
