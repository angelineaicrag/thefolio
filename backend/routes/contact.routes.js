// backend/routes/contact.routes.js
const express = require('express');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// POST /api/contact - Submit contact form (anyone can use - no login required)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const contact = await Contact.create({ 
      name, 
      email, 
      subject, 
      message 
    });
    
    res.status(201).json({ 
      message: 'Message sent successfully!', 
      contact 
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/contact/admin - Get all messages (admin only)
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/contact/admin/:id/status - Update message status (admin only)
router.put('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/contact/admin/:id - Delete message (admin only)
router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;