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
    console.log(`${username} Join attempt for room: ${roomCode}`);
    console.log(`Current rooms:`, io.sockets.adapter.rooms);
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (!room) {
      console.log(`Room ${roomCode} not found!`);
      callback({ success: false, error: 'Room not found' });
      return;
    }
    console.log(`Room found with ${room.size} players`);
    if (room.size >= 2) {
      callback({ success: false, error: 'Room is full' });
      return;
    }
    socket.join(roomCode);
    callback({ success: true });
    // Notify both players when room is full
    if (io.sockets.adapter.rooms.get(roomCode)?.size === 2) {
      console.log(`🔥 Emitting battleStart for ${roomCode}`);
      io.to(roomCode).emit('battleStart', { roomCode }); // Include roomCode in event
    }
  });
});

// Start server on port 3001
httpServer.listen(3001, () => {
  console.log('Socket.IO server running on http://localhost:3001');
});