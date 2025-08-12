const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['lab', 'sports_facility', 'meeting_room'], required: true },
  capacity: { type: Number },
  location: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Resource', resourceSchema);