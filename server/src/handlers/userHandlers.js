const users = new Map();
const ALL_ROOMS = ["general", "tecnologia", "random"];

function registerUserHandlers(io, socket) {
  socket.on("set_username", (username) => {
    users.set(socket.id, { id: socket.id, username, room: null });
    console.log(`[+] Usuario conectado: ${username} (${socket.id})`);

    ALL_ROOMS.forEach((room) => socket.join(room));

    socket.emit("username_set", { id: socket.id, username });
    io.emit("users_list", getUsersList());
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`[-] Usuario desconectado: ${user.username} (${socket.id})`);
      users.delete(socket.id);
      io.emit("users_list", getUsersList());
      if (user.room) {
        io.to(user.room).emit("user_left", { username: user.username, room: user.room });
      }
    }
  });
}

function getUsersList() {
  return Array.from(users.values());
}

function getUser(socketId) {
  return users.get(socketId);
}

function updateUserRoom(socketId, room) {
  const user = users.get(socketId);
  if (user) users.set(socketId, { ...user, room });
}

module.exports = { registerUserHandlers, getUsersList, getUser, updateUserRoom };
