import { Conversation, Message } from "./chat.model.js";

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

    const isAdmin = userRole?.name === "admin" || 
                    userRole?.name === "superadmin" || 
                    (typeof userRole === "string" && (userRole === "admin" || userRole === "superadmin"));

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
          message: await Message.findById(newMessage._id).populate("sender", "name avatar role"),
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

    socket.on("disconnect", () => {
      console.log(`🛰️ Link Terminated: ${socket.user.name}`);
    });
  });
};