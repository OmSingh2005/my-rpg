"use client";

import { useState } from 'react';
import CreateRoomModal from '@/components/lobby/CreateRoomModal';
import JoinRoomModal from '@/components/lobby/JoinRoomModal';

export default function Home() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">PvP Battle Arena</h1>
      
      <div className="w-full max-w-md space-y-4">
        {/* Username Input */}
        <div>
          <label htmlFor="username" className="block mb-2">Your Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your username"
          />
        </div>

        {/* Create Room Button */}
        <button
          disabled={!username}
          onClick={() => setShowModal(true)}
          className={`w-full p-2 rounded ${
            username ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          } text-white`}
        >
          Create Room
        </button>

        {/* Room Code Modal */}
        {showModal && (
          <CreateRoomModal
            onClose={() => setShowModal(false)}
            username={username} // Pass username as a prop
          />
        )}

        {/* Join Room Section */}
        <div className="space-y-2">
          <label htmlFor="roomCode" className="block mb-2">Room Code</label>
          <input
            id="roomCode"
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            disabled={!username}
            className="w-full p-2 border rounded disabled:bg-gray-100"
            placeholder="Enter room code"
          />
          <button
            disabled={!username || !roomCode}
            onClick={() => setShowJoinModal(true)}
            className={`w-full p-2 rounded ${(username && roomCode) ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} text-white`}
          >
            Join Room
          </button>
          {/* Add the modal render: */}
          {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} username={username} />}
        </div>
      </div>
    </main>
  );
}