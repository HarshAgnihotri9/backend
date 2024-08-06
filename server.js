import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { createRequire } from 'module'; // Import createRequire function
const require = createRequire(import.meta.url); // Create require function for CommonJS modules
const socketIo = require('socket.io'); // Import socket.io using require

import router from './Routes/Userrouter.js';
import adminRouter from './Routes/AdminRoute.js';

// Load environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/user', router);
app.use('/api/admin', adminRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello everyone');
});

// Store usernames
const users = {};

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`A user connected with socket ID: ${socket.id}`);

  // Handle setting the username
  socket.on('set_username', (username) => {
    users[socket.id] = username;
    console.log(`User ${username} connected with ID: ${socket.id}`);
    // Optionally broadcast or log the event when a new user connects
    io.emit('user_connected', { username, socketId: socket.id });
  });

  // Handle incoming messages
  socket.on('send_message', ({ message }) => {
    const username = users[socket.id] || 'Anonymous';
    console.log(`Message from ${username}: ${message}`);
    // Broadcast the message to all other clients except the sender
    socket.broadcast.emit('receive_message', { message, senderId: socket.id, username });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`User ${username || 'Anonymous'} disconnected with socket ID: ${socket.id}`);
    delete users[socket.id];
    // Optionally broadcast or log the event when a user disconnects
    io.emit('user_disconnected', { username, socketId: socket.id });
  });
});

// Connect to MongoDB and start the server
const port = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with a failure code
  }
};

startServer();
