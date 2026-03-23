import { useState, useRef } from "react";
import socket from "../socket/socket";
import useChatStore from "../store/useChatStore";

function MessageInput() {
  const [text, setText] = useState("");
  const currentRoom = useChatStore((s) => s.currentRoom);
  const isTyping = useRef(false);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!isTyping.current) {
      isTyping.current = true;
      socket.emit("typing_start", currentRoom);
    }
    clearTimeout(window._typingTimeout);
    window._typingTimeout = setTimeout(() => {
      isTyping.current = false;
      socket.emit("typing_stop", currentRoom);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !currentRoom) return;
    socket.emit("send_message", { room: currentRoom, message: text.trim() });
    setText("");
    isTyping.current = false;
    socket.emit("typing_stop", currentRoom);
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={handleChange}
        placeholder={currentRoom ? `Mensaje en #${currentRoom}` : "Únete a una sala primero"}
        disabled={!currentRoom}
      />
      <button type="submit" disabled={!currentRoom}>
        Enviar
      </button>
    </form>
  );
}

export default MessageInput;
