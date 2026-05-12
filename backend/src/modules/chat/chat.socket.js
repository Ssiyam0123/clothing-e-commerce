import { Conversation } from "./chat.model.js";

/**
 * 🛰️ Vanguard Chat Engine: Socket Event Handlers
 * Scalable Room-based Architecture
 */
export const initSocketEvents = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    const userRole = socket.user.role;

    console.log(`📡 Satellite Link Established: ${socket.user.name} [${userRole}]`);

    // 🏠 Join a private room for personal transmissions
    socket.join(userId);

    // 🛡️ Admin Protocol: Join a dedicated support room if needed
    if (userRole?.name === "admin") {
      socket.join("admin_support_room");
    }

    /**
     * @event send_message
     * @payload { recipientId, text }
     */
    socket.on("send_message", async ({ text, recipientId }) => {
      try {
        const { user } = socket;
        const senderId = user._id.toString();

        if (!text) return;

        let conversation;
        if (user.role?.name === "customer") {
          // Find or create a conversation for this customer (without a specific admin)
          conversation = await Conversation.findOne({
            participants: { $in: [senderId] },
            type: "support",
          });
          if (!conversation) {
            conversation = await Conversation.create({
              participants: [senderId],
              type: "support",
              messages: [],
            });
          }
          // Broadcast to all admins (admin_support_room)
          const message = { 
            sender: senderId, 
            text: text.trim(), 
            isRead: false, 
            createdAt: new Date() 
          };
          
          conversation.messages.push(message);
          conversation.lastMessage = text.trim();
          await conversation.save();

          const broadcastData = {
            conversationId: conversation._id,
            customerId: senderId,
            customerName: user.name,
            message,
          };

          io.to("admin_support_room").emit("new_message", broadcastData);
          // Also echo back to sender (for UI consistency)
          io.to(senderId).emit("new_message", broadcastData);
        } 
        else if (user.role?.name === "admin") {
          // Admin replying to a specific customer
          if (!recipientId) return;
          
          conversation = await Conversation.findOne({
            participants: { $in: [recipientId] },
            type: "support",
          });
          
          if (!conversation) return;
          
          // Add admin to participants if not already there
          if (!conversation.participants.includes(senderId)) {
            conversation.participants.push(senderId);
          }

          const message = { 
            sender: senderId, 
            text: text.trim(), 
            isRead: true, 
            createdAt: new Date() 
          };
          
          conversation.messages.push(message);
          conversation.lastMessage = text.trim();
          await conversation.save();

          const broadcastData = { 
            conversationId: conversation._id, 
            message 
          };

          io.to(recipientId).emit("new_message", broadcastData);
          // Also send to admin's own other sessions
          io.to(senderId).emit("new_message", broadcastData);
        }
      } catch (err) {
        console.error("🚨 Transmission Failure:", err.message);
        socket.emit("error_report", { message: "Message could not be synchronized." });
      }
    });

    /**
     * @event typing_start
     */
    socket.on("typing_start", ({ recipientId }) => {
      socket.to(recipientId).emit("user_typing", { userId });
    });

    /**
     * @event typing_stop
     */
    socket.on("typing_stop", ({ recipientId }) => {
      socket.to(recipientId).emit("user_stop_typing", { userId });
    });

    // 🔴 Link Termination
    socket.on("disconnect", () => {
      console.log(`🛰️ Link Terminated: ${socket.user.name}`);
    });
  });
};