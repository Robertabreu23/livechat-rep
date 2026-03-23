function ChatBubbleIcon({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="navBubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="navInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="navGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sombra */}
      <path
        d="M4 4 C4 2 6 0 8 0 H40 C42 0 44 2 44 4 V30 C44 32 42 34 40 34 H27 L20 42 L18 34 H8 C6 34 4 32 4 30 Z"
        fill="url(#navBubbleGrad)"
        opacity="0.25"
        transform="translate(1.5, 1.5)"
      />
      {/* Burbuja principal */}
      <path
        d="M4 4 C4 2 6 0 8 0 H40 C42 0 44 2 44 4 V30 C44 32 42 34 40 34 H27 L20 42 L18 34 H8 C6 34 4 32 4 30 Z"
        fill="url(#navBubbleGrad)"
        filter="url(#navGlow)"
      />
      {/* Burbuja interior */}
      <path
        d="M7 6 C7 4.5 8.5 3 10 3 H38 C39.5 3 41 4.5 41 6 V28 C41 29.5 39.5 31 38 31 H26 L20 39 L18 31 H10 C8.5 31 7 29.5 7 28 Z"
        fill="url(#navInner)"
      />
      {/* Reflejo superior */}
      <path
        d="M10 5 Q24 3.5 38 5.5"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Puntos */}
      <circle cx="17" cy="17" r="3" fill="white" opacity="0.95" />
      <circle cx="24" cy="17" r="3" fill="white" opacity="0.95" />
      <circle cx="31" cy="17" r="3" fill="white" opacity="0.95" />
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <ChatBubbleIcon size={32} />
        <span className="navbar-title">
          <span className="navbar-live">Live</span>
          <span className="navbar-chat">Chat</span>
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
