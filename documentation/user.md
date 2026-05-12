# User API Documentation

Base URL: `/api/users`

---

## 1. Authenticated User Endpoints (Private)

### Get My Profile
`GET /me`

Returns the profile of the currently logged-in user.

**Response:**
```json
{
  "_id": "64b1d...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "017XXXXXXXX",
  "avatar": "https://...",
  "role": "user",
  "bio": "I love shopping!"
}
```

---

### Update My Profile
`PUT /profile`

Updates the profile of the currently logged-in user. Supports multipart/form-data for avatar upload.

**Request Body (form-data):**
- `name`: string
- `phone`: string
- `bio`: string
- `avatar`: file (optional)

**Response:** Returns the updated user object.

---

### Change Password
`PUT /change-password`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:** `{ "message": "Password updated successfully" }`

---

## 2. Admin Endpoints (Private/Admin Only)

### Get All Users
`GET /`

**Query Parameters:**
- `search`: Search by name or email (regex, case-insensitive)
- `sort`: Sorting field (e.g., `name`, `-createdAt`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 30)

**Response:**
```json
{
  "users": [...],
  "total": 100,
  "page": 1,
  "pages": 4
}
```

---

### Get User by ID
`GET /:id`

---

### Update User
`PUT /:id`

Admin can update any user's name, email, role, phone, bio, and avatar.

**Request Body (form-data):**
- `name`, `email`, `role`, `phone`, `bio`: strings
- `avatar`: file (optional)

---

### Delete User
`DELETE /:id`

Removes a user and their avatar from storage. Admins cannot delete themselves.
