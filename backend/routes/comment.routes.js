// backend/routes/comment.routes.js
const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const router = express.Router();

// GET /api/comments/:postId - Get all comments for a post (with replies)
router.get('/:postId', async (req, res) => {
  try {
    // Get top-level comments (no parent)
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null
    })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });
    
    // Get replies for each comment
    for (let comment of comments) {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate('author', 'name profilePic')
        .sort({ createdAt: 1 });
      comment._doc.replies = replies;
    }
    
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/comments/:postId - Add a comment or reply
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      body: req.body.body,
      parentComment: req.body.parentComment || null
    });
    await comment.populate('author', 'name profilePic');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/comments/:id - Delete comment (and its replies)
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: req.params.id });
    await comment.deleteOne();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;