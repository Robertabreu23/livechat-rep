import { useState } from "react";
import socket from "../socket/socket";
import useChatStore from "../store/useChatStore";

function Login() {
  const [input, setInput] = useState("");
  const setUsername = useChatStore((s) => s.setUsername);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.connect();
    socket.emit("set_username", input.trim());
    socket.once("username_set", ({ username }) => {
      setUsername(username);
    });
  };

  return (
    <div className="login">
      <h2>Bienvenido a LiveChat</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tu nombre de usuario"
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
