const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth'); 
const router = express.Router();

router.get('/', authMiddleware,async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.put('/', authMiddleware, async (req, res) => {
    try {
        const { profilePic, bio } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic, bio },
            { new: true, select: '-password' } 
        );

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { username, bio, profilePic } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, bio, profilePic },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Get public profile by username
router.get('/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

module.exports = router;

