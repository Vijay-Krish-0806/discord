import { useSocket } from "@/app/components/providers/SocketContext";
import { useEffect, useState } from "react";

type TypingUser = {
  userId: string;
  username: string;
  roomId: string;
};

type UseTypingIndicatorProps = {
  roomId: string;
};

export const useTypingIndicator = ({ roomId }: UseTypingIndicatorProps) => {
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef: { current: NodeJS.Timeout | null } = {
    current: null,
  };

  // Listen for typing events
  useEffect(() => {
    if (!socket) return;

    socket.on("typing", (data: TypingUser) => {
      console.log(`✏️ ${data.username} is typing...`);

      setTypingUsers((prev) => {
        // Check if user is already in the list
        const userExists = prev.some((user) => user.userId === data.userId);
        if (userExists) {
          return prev;
        }
        return [...prev, data];
      });

      // Remove user after 3 seconds of inactivity
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers((prev) =>
          prev.filter((user) => user.userId !== data.userId)
        );
      }, 3000);
    });

    return () => {
      socket.off("typing");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket]);

  // Emit typing event when user is typing
  const emitTyping = () => {
    if (socket) {
      socket.emit("startTyping", roomId);
    }
  };

  return {
    typingUsers,
    emitTyping,
  };
};
