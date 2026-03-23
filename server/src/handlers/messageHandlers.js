const { getUser, updateUserRoom } = require("./userHandlers");

const roomHistory = new Map(); // room -> messages[]
const MAX_HISTORY = 50;

function registerMessageHandlers(io, socket) {
  socket.on("join_room", (room) => {
    const user = getUser(socket.id);
    if (!user) return;

    if (user.room) socket.leave(user.room);
    socket.join(room);
    updateUserRoom(socket.id, room);

    console.log(`[>] ${user.username} se unió a la sala: ${room}`);
    io.to(room).emit("user_joined", { username: user.username, room });

    const history = roomHistory.get(room) || [];
    socket.emit("room_history", { room, messages: history });
  });

  socket.on("send_message", ({ room, message }) => {
    const user = getUser(socket.id);
    if (!user) return;

    const payload = {
      id: Date.now(),
      username: user.username,
      message,
      room,
      timestamp: new Date().toISOString(),
    };

    if (!roomHistory.has(room)) roomHistory.set(room, []);
    const msgs = roomHistory.get(room);
    msgs.push(payload);
    if (msgs.length > MAX_HISTORY) msgs.shift();

    console.log(`[msg] ${user.username} en #${room}: ${message}`);
    io.to(room).emit("receive_message", payload);
  });
}

module.exports = { registerMessageHandlers };
