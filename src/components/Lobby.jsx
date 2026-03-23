import { useState } from "react";
import socket from "../socket/socket";
import useChatStore from "../store/useChatStore";

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function Lobby() {
  const { username, setCurrentRoom } = useChatStore();
  const [joinId, setJoinId] = useState("");
  const [pendingRoom, setPendingRoom] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const id = generateRoomId();
    setPendingRoom(id);
  };

  const handleEnterCreated = () => {
    socket.emit("join_room", pendingRoom);
    setCurrentRoom(pendingRoom);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const id = joinId.trim().toUpperCase();
    if (!id) return;
    socket.emit("join_room", id);
    setCurrentRoom(id);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pendingRoom).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="lobby">
      <div className="lobby-header">
        <h2>Hola, <span className="lobby-username">{username}</span></h2>
        <p className="lobby-subtitle">¿Qué quieres hacer?</p>
      </div>

      <div className="lobby-options">
        <div className="lobby-card">
          <h3>Crear sala</h3>
          <p>Genera un ID y compártelo para chatear en privado.</p>

          {pendingRoom ? (
            <div className="lobby-created">
              <p className="lobby-id-label">ID de tu sala:</p>
              <div className="lobby-id-box">
                <span className="lobby-id-text">{pendingRoom}</span>
                <button className="lobby-copy-btn" onClick={handleCopy}>
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <button className="lobby-btn primary" onClick={handleEnterCreated}>
                Entrar a la sala
              </button>
            </div>
          ) : (
            <button className="lobby-btn primary" onClick={handleCreate}>
              Crear sala
            </button>
          )}
        </div>

        <div className="lobby-divider">
          <span>o</span>
        </div>

        <div className="lobby-card">
          <h3>Unirse a sala</h3>
          <p>Ingresa el ID que alguien te compartió.</p>
          <form onSubmit={handleJoin} className="lobby-join-form">
            <input
              value={joinId}
              onChange={(e) => setJoinId(e.target.value.toUpperCase())}
              placeholder="Ej: AB12CD"
              maxLength={6}
              className="lobby-join-input"
            />
            <button type="submit" className="lobby-btn secondary">
              Unirse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
