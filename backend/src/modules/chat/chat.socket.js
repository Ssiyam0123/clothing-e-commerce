import { Conversation, Message } from "./chat.model.js";

// 📡 Online users tracker: Map<userId, Set<socketId>>
const onlineUsers = new Map();

/**
 * 🛰️ Vanguard Chat Engine: High-Performance Socket Handlers
 * Scalable Architecture for 100k+ Users
 */
export const initSocketEvents = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    const userRole = socket.user.role;

    console.log(`📡 Satellite Link Established: ${socket.user.name} [${userRole?.name || userRole}]`);
    socket.join(userId);

    // Track online user
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast current online users list
    io.emit("online_users", Array.from(onlineUsers.keys()));

    const userRoleName = userRole?.name || (typeof userRole === "string" ? userRole : "");
    const isAdmin = userRoleName === "superadmin" || (userRoleName !== "customer" && userRoleName);

    if (isAdmin) {
      socket.join("admin_support_room");
    }

    /**
     * @event send_message
     * @payload { text, image, conversationId, recipientId }
     */
    socket.on("send_message", async ({ text, image, conversationId, recipientId }) => {
      try {
        const senderId = socket.user._id.toString();
        if (!text && !image) return;

        // 1. Resolve Conversation
        let conversation;
        if (conversationId) {
          conversation = await Conversation.findById(conversationId);
        } else {
          // If no conversationId, find or create one for the customer
          const targetId = isAdmin ? recipientId : senderId;
          conversation = await Conversation.findOne({
            participants: targetId,
            type: "support"
          });

          if (!conversation) {
            conversation = await Conversation.create({
              participants: [targetId],
              type: "support"
            });
          }
        }

        if (!conversation) throw new Error("Conversation not found");

        // 2. Save to Message collection
        const newMessage = await Message.create({
          conversationId: conversation._id,
          sender: senderId,
          text,
          image,
          isRead: false
        });

        // 3. Update last message preview
        await Conversation.findByIdAndUpdate(conversation._id, {
          $set: {
            lastMessage: {
              text: text || "Sent an image",
              sender: senderId,
              createdAt: new Date()
            }
          }
        });

        const broadcastData = {
          message: await Message.findById(newMessage._id).populate({
            path: "sender",
            select: "name avatar role",
            populate: { path: "role", select: "name" }
          }),
          conversationId: conversation._id
        };

        // 4. Real-time Broadcasting
        if (isAdmin) {
          // Admin -> Specific User
          io.to(recipientId).emit("new_message", broadcastData);
        } else {
          // User -> All Admins
          io.to("admin_support_room").emit("new_message", broadcastData);
        }

        // Echo back to sender
        socket.emit("new_message", broadcastData);

      } catch (err) {
        console.error("🚨 Transmission Failure:", err.message);
        socket.emit("error_report", { message: "Message delivery failed." });
      }
    });

    /**
     * @event edit_message
     * @payload { messageId, text }
     */
    socket.on("edit_message", async ({ messageId, text }) => {
      try {
        const senderId = socket.user._id.toString();
        if (!text || !text.trim()) return;

        const message = await Message.findById(messageId);
        if (!message) throw new Error("Message not found");

        if (message.sender.toString() !== senderId) {
          throw new Error("Unauthorized to edit this message");
        }

        message.text = text;
        message.isEdited = true;
        await message.save();

        // If this was the last message, update conversation preview
        const conversation = await Conversation.findById(message.conversationId);
        if (conversation && conversation.lastMessage && conversation.lastMessage.sender?.toString() === senderId) {
          const lastMsg = await Message.findOne({ conversationId: conversation._id }).sort("-createdAt");
          if (lastMsg && lastMsg._id.toString() === messageId) {
            await Conversation.findByIdAndUpdate(conversation._id, {
              $set: {
                "lastMessage.text": text
              }
            });
          }
        }

        const updatedMessage = await Message.findById(messageId).populate({
          path: "sender",
          select: "name avatar role",
          populate: { path: "role", select: "name" }
        });

        // Broadcast to all participants and admin support room
        if (conversation) {
          conversation.participants.forEach(p => {
            io.to(p.toString()).emit("message_edited", {
              messageId,
              text,
              conversationId: message.conversationId,
              message: updatedMessage
            });
          });
        }
        io.to("admin_support_room").emit("message_edited", {
          messageId,
          text,
          conversationId: message.conversationId,
          message: updatedMessage
        });
      } catch (err) {
        console.error("🚨 Edit Message Failure:", err.message);
        socket.emit("error_report", { message: err.message });
      }
    });

    /**
     * @event delete_message
     * @payload { messageId }
     */
    socket.on("delete_message", async ({ messageId }) => {
      try {
        const senderId = socket.user._id.toString();
        const message = await Message.findById(messageId);
        if (!message) throw new Error("Message not found");

        if (message.sender.toString() !== senderId) {
          throw new Error("Unauthorized to delete this message");
        }

        const conversationId = message.conversationId;
        await Message.findByIdAndDelete(messageId);

        // Update conversation lastMessage preview
        const lastMsg = await Message.findOne({ conversationId }).sort("-createdAt");
        if (lastMsg) {
          await Conversation.findByIdAndUpdate(conversationId, {
            $set: {
              lastMessage: {
                text: lastMsg.text || "Sent an image",
                sender: lastMsg.sender,
                createdAt: lastMsg.createdAt
              }
            }
          });
        } else {
          await Conversation.findByIdAndUpdate(conversationId, {
            $unset: { lastMessage: "" }
          });
        }

        // Broadcast to all participants and admin support room
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.participants.forEach(p => {
            io.to(p.toString()).emit("message_deleted", {
              messageId,
              conversationId
            });
          });
        }
        io.to("admin_support_room").emit("message_deleted", {
          messageId,
          conversationId
        });
      } catch (err) {
        console.error("🚨 Delete Message Failure:", err.message);
        socket.emit("error_report", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🛰️ Link Terminated: ${socket.user.name}`);
      
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }
      
      // Broadcast updated online users list
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
};