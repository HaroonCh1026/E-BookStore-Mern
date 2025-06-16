const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ msg: 'Access denied. No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Access denied. Token missing' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ msg: 'Internal server error' });
        }

        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifiedUser; 
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ msg: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ msg: 'Invalid token' });
        } else {
            console.error('JWT Verification Error:', err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    }
};

module.exports = authenticateToken;
