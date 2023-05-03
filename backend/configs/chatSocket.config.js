import {Server as socketIO} from "socket.io";
import Message from "../models/message.model.js";
import {
  isUserAllowedInRoom,
  isUsernameAllowedInRoom,
  validateInput,
} from "../utils/chat.utils.js";
const configureChatSocket = (server) => {
  const io = new socketIO(server, {
    cors: {
      origin: [
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.use((socket, next) => {
    socket.userId = socket.handshake.query.userId;
    next()
  });
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", async ({chatId, user}) => {
      const sanitizedChatId = validateInput(chatId);
      const sanitizedUser = validateInput(user);

      if (!sanitizedChatId || !sanitizedUser) {
        socket.emit("error", "Invalid input data");
        return;
      }
    
        const allowed = await isUserAllowedInRoom(socket.userId, chatId);
        if (allowed) {
          console.log(`${user} joined room ${chatId}`);
          socket.join(chatId);
          const messages = await Message.find({chatId: chatId});
          socket.emit("messages", messages);
        } else {
          socket.emit("error", "You are not allowed to join this room");
        }
    });

    socket.on("message", async (message) => {
      const sanitizedMessageUser = validateInput(message.user);
      const sanitizedMessageChatId = validateInput(message.chatId);
      const sanitizedMessageText = validateInput(message.text);
      if (
        !sanitizedMessageUser ||
        !sanitizedMessageChatId ||
        !sanitizedMessageText
      ) {
        socket.emit("error", "Invalid input data");
        return;
      }
      const allowed = await isUsernameAllowedInRoom(
        message.user,
        message.chatId
      );

      if (
        allowed
      ) {
        console.log(`Message received in server: ${message.text}`, message);
        const newMessage = new Message({
          chatId: message.chatId,
          text: message.text,
          user: message.user,
          createdAt: new Date(),
        });
        await newMessage.save();
        io.to(message.chatId).emit("message", newMessage);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default configureChatSocket;