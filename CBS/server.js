const path = require('path');
const envPath = path.join(__dirname, '.env');

require('dotenv').config({ 
  path: envPath,
  debug: true // Shows loaded vars in console
});

console.log('Loading .env from:', envPath);
console.log('Environment Variables:', {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./campus-booking-mongodb/models/User');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 27017, // Timeout after 5s
  retryWrites: true
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit if DB connection fails
  });

// Test Route
app.get('/', (req, res) => {
  res.send('Campus Booking System API');
});

// Start Server
// app.listen removed to avoid port conflicts. Use server.listen only.



// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, fullName, department } = req.body;
    const user = new User({ email, passwordHash: password, role, fullName, department });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

// SOCKET.IO
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

// Emit booking updates
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Replace app.listen with server.listen
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Emit when a booking is created
const emitBookingUpdate = (booking) => {
  io.emit('bookingUpdate', booking);
};

// Modify POST /bookings to emit updates
// This code should be in the booking route, not here. Remove this block from server.js.