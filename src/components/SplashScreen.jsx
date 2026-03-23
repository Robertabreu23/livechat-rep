import { useEffect, useState } from "react";

function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const doneTimer = setTimeout(() => onDone(), 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash${fading ? " splash-fade" : ""}`}>
      <div className="splash-logo">
        {/* Chat bubble SVG */}
        <svg
          className="splash-bubble"
          viewBox="0 0 120 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a6ef5" />
              <stop offset="100%" stopColor="#00c6ff" />
            </linearGradient>
            <linearGradient id="bubbleInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d47c2" />
              <stop offset="100%" stopColor="#0891d4" />
            </linearGradient>
          </defs>
          {/* Sombra / capa exterior */}
          <path
            d="M10 8 C10 4 14 0 18 0 H102 C106 0 110 4 110 8 V72 C110 76 106 80 102 80 H64 L48 98 L44 80 H18 C14 80 10 76 10 72 Z"
            fill="url(#bubbleGrad)"
            opacity="0.3"
            transform="translate(2,2)"
          />
          {/* Burbuja principal */}
          <path
            d="M10 8 C10 4 14 0 18 0 H102 C106 0 110 4 110 8 V72 C110 76 106 80 102 80 H64 L48 98 L44 80 H18 C14 80 10 76 10 72 Z"
            fill="url(#bubbleGrad)"
          />
          {/* Burbuja interior (reflejo) */}
          <path
            d="M16 12 C16 9 19 6 22 6 H98 C101 6 104 9 104 12 V68 C104 71 101 74 98 74 H62 L48 90 L44 74 H22 C19 74 16 71 16 68 Z"
            fill="url(#bubbleInner)"
          />
          {/* Reflejo de luz */}
          <path
            d="M22 10 Q60 8 98 12"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Puntos animados */}
          <circle className="dot dot1" cx="38" cy="40" r="7" fill="white" />
          <circle className="dot dot2" cx="60" cy="40" r="7" fill="white" />
          <circle className="dot dot3" cx="82" cy="40" r="7" fill="white" />
          {/* Chispas */}
          <circle cx="108" cy="4" r="2.5" fill="#00c6ff" opacity="0.9" />
          <circle cx="115" cy="12" r="1.5" fill="#00c6ff" opacity="0.7" />
          <circle cx="112" cy="20" r="1" fill="#00c6ff" opacity="0.5" />
        </svg>

        <span className="splash-title">
          <span className="splash-live">Live</span>
          <span className="splash-chat">Chat</span>
        </span>
      </div>

      <div className="splash-bar">
        <div className="splash-bar-fill" />
      </div>
    </div>
  );
}

export default SplashScreen;
