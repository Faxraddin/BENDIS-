import socketIo from "socket.io";
import Message from "../models/chat";

const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chatMessage", async (data) => {
    try {
      const { sender, receiver, message } = data;

      const newMessage = new Message({
        sender,
        receiver,
        message,
      });

      const savedMessage = await newMessage.save();

      socket.broadcast.emit("newMessage", savedMessage);
    } catch (error) {
      console.error("Error saving and broadcasting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
