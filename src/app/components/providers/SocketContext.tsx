// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import type { ServerToClientEvents, ClientToServerEvents } from "shared";

// type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

// interface SocketContextType {
//   socket: SocketType | null;
//   isConnected: boolean;
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
// });

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocket must be used within SocketProvider");
//   }
//   return context;
// };

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const [socket, setSocket] = useState<SocketType | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

//     const socketInstance: SocketType = io(socketUrl, {
//       withCredentials: true,
//       autoConnect: true,
//       addTrailingSlash: false,
//     });

//     socketInstance.on("connect", () => {
//       console.log("✅ Connected to Socket.IO server");
//       setIsConnected(true);
//     });

//     socketInstance.on("disconnect", () => {
//       console.log("❌ Disconnected from Socket.IO server");
//       setIsConnected(false);
//     });

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "shared";

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    
    console.log("🔌 Attempting to connect to:", socketUrl);

    const socketInstance: SocketType = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      addTrailingSlash: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Disconnected from Socket.IO server. Reason:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

  

    setSocket(socketInstance);

    return () => {
      console.log("🧹 Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};