const {getUser} = require("./userHandlers");

function registerTypingHandlers(io,socket) {
    socket.on("typing_start", (room)=>{
        const user = getUser(socket.id);
        if(!user) return;
        socket.to(room).emit("user_typing",{username: user.username, isTyping: true});
    });



    socket.on("typing_stop",(room)=>{
        const user = getUser(socket.id);
        if(!user) return;
        socket.to(room).emit("user_typing",{username:user.username,isTyping:false});

    });
}

module.exports = {registerTypingHandlers};