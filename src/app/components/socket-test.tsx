"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/app/components/providers/SocketContext";
import type { MessageData } from "shared";

export default function SocketTest() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [roomId] = useState("test-room");

  useEffect(() => {
    if (!socket) return;

    // Join the test room
    socket.emit("joinRoom", roomId);

    // Listen for messages
    socket.on("message", (data: MessageData) => {
      setMessages((prev) => [...prev, data]);
    });

    // Listen for user joined
    socket.on("userJoined", (data) => {
      console.log("User joined:", data);
    });

    // Listen for user left
    socket.on("userLeft", (data) => {
      console.log("User left:", data);
    });

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("message");
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (!socket || !inputValue.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      content: inputValue,
    });

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Socket.IO Test</h1>

      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
          border: `1px solid ${isConnected ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "4px",
          color: isConnected ? "#155724" : "#721c24",
        }}
      >
        Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
          minHeight: "300px",
          maxHeight: "400px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Messages in room: {roomId}</h3>
        {messages.length === 0 ? (
          <p style={{ color: "#666" }}>
            No messages yet. Send one to get started!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "white",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ fontWeight: "bold", color: "#007bff" }}>
                {msg.username}
              </div>
              <div style={{ marginTop: "5px" }}>{msg.content}</div>
              <div
                style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isConnected}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !inputValue.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor:
              isConnected && inputValue.trim() ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor:
              isConnected && inputValue.trim() ? "pointer" : "not-allowed",
            fontSize: "14px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
