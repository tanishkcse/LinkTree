const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { username, password, profilePic, bio } = req.body;

        if (!username || !password) {
            return res.status(400).send({ error: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).send({ error: 'Username already taken' });

        const user = new User({
            username,
            password,
            profilePic: profilePic || '',  
            bio: bio || ''                  
        });

        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Registration failed, please try again' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(404).send({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).send({ error: 'Login failed, please try again' });
    }
});

module.exports = router;

