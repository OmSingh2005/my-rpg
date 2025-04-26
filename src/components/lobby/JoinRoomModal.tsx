"use client";
import { useState } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

export default function JoinRoomModal({ onClose, username }: { onClose: () => void; username: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    console.log("Attempting to join room:", code);
    const socket = io("http://localhost:3001");

    // Add error listeners
    socket.on("connect_error", (err: Error) => {
      console.error("Connection error:", err.message || err);
      setError("Failed to connect to the server. Please try again.");
    });

    socket.emit("joinRoom", code, username, (response: { success: boolean; error?: string }) => {
      console.log("Server response:", response);
      if (response.success) {
        socket.on("battleStart", (data: { roomCode: string }) => {
            console.log("Redirecting to battle room:", data.roomCode);
            router.push(`/battle/${data.roomCode}`);
        });
      } else {
        setError(response.error || "Failed to join the room.");
      }
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-4">Join a Room</h2>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter Room Code"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex space-x-2">
          <button
            onClick={handleJoin}
            disabled={!code}
            className={`w-full p-2 rounded ${
              code ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
            } text-white`}
          >
            Join
          </button>
          <button
            onClick={onClose}
            className="w-full p-2 rounded bg-gray-500 text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}