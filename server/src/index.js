const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const {initSocket} = require ("./config/socket");

const PORT = process.env.PORT || 3001;

// Normaliza un origen: quita espacios y la barra final para comparar de forma fiable
const normalize = (o) => o.trim().replace(/\/+$/, "");

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:5173"]
).map(normalize).filter(Boolean);

console.log("[cors] Orígenes permitidos:", ALLOWED_ORIGINS);

// Función de chequeo: permite peticiones sin origen (curl/health) y orígenes normalizados
const corsOrigin = (origin, callback) => {
  if (!origin || ALLOWED_ORIGINS.includes(normalize(origin))) {
    return callback(null, true);
  }
  console.warn("[cors] Origen bloqueado:", origin);
  return callback(new Error("Not allowed by CORS"));
};

const app = express();
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});

initSocket(io);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});