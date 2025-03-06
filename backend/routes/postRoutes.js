const express = require('express');
const Post = require('../models/Post'); 
const router = express.Router();
const { authMiddleware } = require('../middleware/auth'); 


router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { caption, image } = req.body;
        console.log(req.body)

        if (!caption) {
            return res.status(400).json({ error: 'Caption is required' });
        }
        console.log(req)
        const post = new Post({
            user: req.user.id, 
            caption,
            image
        });

        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});


router.get('/', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id })
        .sort({ createdAt: -1 });

        res.json(posts);
        console.log(posts)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get a Single Post by ID
router.get('/:postId', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.postId, user: req.user.id });
        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});


router.put('/:postId', authMiddleware, async (req, res) => {
    try {
        const { caption } = req.body;
        console.log(req.body)
        if (!caption) return res.status(400).json({ error: 'Caption is required' });

        const post = await Post.findOneAndUpdate(
            { _id: req.params.postId, user: req.user.id },
            { caption, updatedAt: Date.now() },
            { new: true }
        );

        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.json({ message: 'Post updated successfully', post });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});


router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.postId, user: req.user.id });
        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router;
