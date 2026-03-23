const { registerUserHandlers } = require("../handlers/userHandlers");
const { registerMessageHandlers } = require("../handlers/messageHandlers");
const { registerTypingHandlers } = require("../handlers/typingHandlers");

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log(`[socket] Nueva conexión: ${socket.id}`);

    registerUserHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTypingHandlers(io, socket);
  });
}

module.exports = { initSocket };
