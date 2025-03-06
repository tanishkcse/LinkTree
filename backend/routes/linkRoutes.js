const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Add a new link
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, url } = req.body;
        const user = await User.findById(req.user.id);
        user.links.push({ title, url });
        await user.save();
        res.status(201).json({ message: 'Link added successfully', links: user.links });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add link' });
    }
});

// Edit a link
router.put('/edit/:linkId', authMiddleware, async (req, res) => {
    try {
        const { title, url } = req.body;
        const user = await User.findById(req.user.id);
        const link = user.links.id(req.params.linkId);
        if (link) {
            link.title = title;
            link.url = url;
            await user.save();
            res.status(200).json({ message: 'Link updated successfully', links: user.links });
        } else {
            res.status(404).json({ error: 'Link not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update link' });
    }
});

// Delete a link
router.delete('/delete/:linkId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.links.id(req.params.linkId).remove();
        await user.save();
        res.status(200).json({ message: 'Link deleted successfully', links: user.links });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete link' });
    }
});

// Reorder links
router.put('/reorder', authMiddleware, async (req, res) => {
    try {
        const { links } = req.body;
        const user = await User.findById(req.user.id);
        user.links = links;
        await user.save();
        res.status(200).json({ message: 'Links reordered successfully', links: user.links });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reorder links' });
    }
});

module.exports = router;