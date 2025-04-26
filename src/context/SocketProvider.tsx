// /context/SocketProvider.tsx
"use client";
import { ReactNode, useEffect } from "react";
import { initializeSocket, getSocket } from "@/socket/socket";
import { useRouter } from "next/navigation";

export function SocketProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const socket = initializeSocket();

  useEffect(() => {
    socket.connect();

    // Handle battle start globally
    socket.on("battleStart", (data: { roomCode: string }) => {
      router.push(`/battle/${data.roomCode}`);
    });

    return () => {
      socket.off("battleStart");
      // Don't disconnect here - we want persistent connection
    };
  }, [router, socket]);

  return children;
}