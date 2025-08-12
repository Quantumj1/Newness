const express = require('express');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const router = express.Router();
const auth = require('../middleware/auth'); // JWT auth middleware

// Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { resourceId, startTime, endTime } = req.body;

    // Check if the resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check for conflicting bookings
    const conflict = await Booking.findOne({
      resourceId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflict) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      resourceId,
      startTime,
      endTime
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;