"use client"; // Client component for interactivity
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function CreateRoomModal({ onClose, username }: { onClose: () => void ; username: string}) {
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Connect to your Socket.IO server
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      socket.emit("createRoom", username, (code: string) => {
        setRoomCode(code); // Updates with REAL code from server
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-4">Room Created!</h2>
        <p className="mb-2">Share this code with your opponent:</p>
        <div className="flex items-center space-x-2 mb-4">
          <code className="bg-gray-100 p-2 rounded font-mono">{roomCode}</code>
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
