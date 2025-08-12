const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
  fullName: { type: String, required: true },
  department: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);