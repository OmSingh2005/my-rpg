// Top of server.mts
process.removeAllListeners('warning'); // Hide deprecation warnings
// Add at the VERY TOP of server.mts:
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register('ts-node/esm', pathToFileURL('./'));


import { Server } from 'socket.io';
import { createServer } from 'http';

// Create HTTP server
const httpServer = createServer();

// Attach Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*" // Allow all origins (for development only)
  }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createRoom', (username, callback) => {
    const roomCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    socket.join(roomCode);
    callback(roomCode);
    console.log(`Room created: ${roomCode} by ${username}`);
  });
  // AFTER createRoom logic
  socket.on('joinRoom', (roomCode, username, callback) => {
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    if (room.size >= 2) {
      callback({ success: false, error: 'Room is full' });
      return;
    }
    socket.join(roomCode);
    callback({ success: true });
    // Notify both players when room is full
    if (room.size + 1 === 2) {
      io.to(roomCode).emit('battleStart');
    }
  });
});

// Start server on port 3001
httpServer.listen(3001, () => {
  console.log('Socket.IO server running on http://localhost:3001');
});