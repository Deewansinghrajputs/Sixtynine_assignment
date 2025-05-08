const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

// Create server + socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',  // Frontend se connect ho sake
    methods: ['GET', 'POST']
  }
});

// Socket.io Events
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Test Event
  socket.on('chatMessage', (msg) => {
    console.log('Message Received:', msg);
    // Broadcast to all clients
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));
