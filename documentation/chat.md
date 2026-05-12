# Chat API Documentation

Base URL: `/api/chat`

The Chat system uses Socket.io for real-time communication and this REST API for history and management.

---

## 1. REST Endpoints

### Get Chat History
`GET /history/:recipientId` (Authenticated)

Returns the message history between the logged-in user and the recipient (usually Admin).

**Response:**
```json
[
  {
    "sender": "64b1d...",
    "recipient": "64b1f...",
    "message": "Hello, I need help with my order",
    "createdAt": "2024-05-12T..."
  }
]
```

### Get My Conversation
`GET /my-conversation` (Authenticated)

For customers to get their own support conversation thread.

### Get All Conversations (Admin Only)
`GET /conversations`

Returns a list of all unique conversations (users who have sent messages).

### Get Conversation Messages (Admin Only)
`GET /conversations/:id/messages`

---

## 2. Real-time (Socket.io) Events

- **Connection:** Connect to server with `auth` token.
- **`join` event:** Join a specific room (usually `userId`).
- **`send_message` event:** 
  ```json
  {
    "recipientId": "ADMIN_ID",
    "message": "Text here"
  }
  ```
- **`receive_message` event:** Listen for incoming messages.
