# Authentication API Documentation

Base URL: `/api/auth`

---

## 1. Register User
`POST /register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "_id": "64b1d...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": false
  }
}
```

---

## 2. Login User
`POST /login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "_id": "64b1d...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://..."
  }
}
```

---

## 3. Verify Email
`GET /verify-email?token=...`

---

## 4. Forgot Password
`POST /forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

---

## 5. Reset Password
`POST /reset-password`

**Request Body:**
```json
{
  "token": "verification-token-from-email",
  "newPassword": "newsecurepassword123"
}
```

---

## 6. Get Current User Info
`GET /me` (Authenticated)

Returns current user data based on the provided JWT token.
