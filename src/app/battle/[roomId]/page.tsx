"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";

export default function BattlePage() {
  const { roomId } = useParams();
  const socket = io("http://localhost:3001");
  console.log("Battle started in room:", roomId);

  const router = useRouter();

  useEffect(() => {
    console.log("Battle started in room:", roomId);

    socket.emit("joinRoom", roomId);

    socket.on("roomStatus", (status: { roomCode: string; isReady: boolean }) => {
      if (status.isReady) {
        console.log(`🔥 Emitting battleStart for ${roomId}`);
        socket.emit("battleStart", { roomCode: roomId });
      }
    });

    socket.on("battleStart", (data: { roomCode: string }) => {
      console.log("Redirecting to battle room:", data.roomCode);
      router.push(`/battle/${data.roomCode}`);
    });
    
    return () => {
      socket.disconnect();
    };
  });

  return (
    <div className="p-4">
      <h1>Battle Room: {roomId}</h1>
      <p>Waiting for opponent...</p>
    </div>
  );
}