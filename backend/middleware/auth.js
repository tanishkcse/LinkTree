const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = await User.findById(decoded.id).select('-password'); 

        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }
        console.log(req.user)
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
