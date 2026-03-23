import { useEffect, useState, useCallback } from "react";
import socket from "./socket/socket";
import useChatStore from "./store/useChatStore";
import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";
import Lobby from "./components/Lobby";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import MessageInput from "./components/MessageInput";
import TypingIndicator from "./components/TypingIndicator";
import "./index.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashDone = useCallback(() => setShowSplash(false), []);
  const { username, currentRoom, addMessage, setMessages, incrementUnread, setUsers, setTypingUser } = useChatStore();

  useEffect(() => {
    if (!username || !currentRoom) return;

    socket.on("receive_message", (message) => {
      const { currentRoom: room } = useChatStore.getState();
      if (message.room === room) {
        addMessage(message);
      } else {
        incrementUnread(message.room);
      }
    });
    socket.on("room_history", ({ messages }) => setMessages(messages));
    socket.on("users_list", setUsers);
    socket.on("user_typing", ({ username: u, isTyping }) =>
      setTypingUser(u, isTyping)
    );

    return () => {
      socket.off("receive_message");
      socket.off("room_history");
      socket.off("users_list", setUsers);
      socket.off("user_typing");
    };
  }, [username, currentRoom, addMessage, setMessages, incrementUnread, setUsers, setTypingUser]);

  if (showSplash) return <SplashScreen onDone={handleSplashDone} />;
  if (!username) return <Login />;
  if (!currentRoom) return <Lobby />;

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="app">
        <Sidebar />
        <div className="chat-area">
          <ChatBox />
          <TypingIndicator />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}

export default App;
