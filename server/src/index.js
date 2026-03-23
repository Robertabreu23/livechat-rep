const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const {initSocket} = require ("./config/socket");

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:5173"];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  },
});

initSocket(io);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});