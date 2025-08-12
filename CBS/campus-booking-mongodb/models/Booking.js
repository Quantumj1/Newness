const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resourceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resource', 
    required: true 
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'pending'], 
    default: 'confirmed' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Prevent double bookings
bookingSchema.index({ resourceId: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);