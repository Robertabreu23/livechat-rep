import { useState } from "react";
import useChatStore from "../store/useChatStore";

function Sidebar() {
  const { users, currentRoom } = useChatStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentRoom).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Sala actual</h3>
        <div className="sidebar-room-id">
          <span className="sidebar-room-code">{currentRoom}</span>
          <button className="sidebar-copy-btn" onClick={handleCopy} title="Copiar ID">
            {copied ? "✓" : "⎘"}
          </button>
        </div>
        <p className="sidebar-room-hint">Comparte este ID para invitar a alguien</p>
      </div>

      <div className="sidebar-section">
        <h3>Usuarios ({users.length})</h3>
        {users.map((u) => (
          <div key={u.id} className="user-item">
            {u.username}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
