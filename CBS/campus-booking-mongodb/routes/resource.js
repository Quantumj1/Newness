const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Checks if user.role === 'admin'
const router = express.Router();

// Add a new resource (Admin-only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all resources
router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;