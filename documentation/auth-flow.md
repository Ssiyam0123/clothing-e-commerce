# Authentication Flow Documentation

This document explains the authentication states and the step-by-step process for different user types.

## 1. User States

The system distinguishes between two primary user states: **Guest** and **Authenticated (Real) User**.

### A. Guest User (Unauthenticated)
- **Identification:** No `Authorization` header or JWT token is present in the request.
- **Access Level:** Restricted.
- **Permissions:**
  - Can browse products, categories, and subcategories.
  - Can search for items.
  - Can add items to a local cart (if handled on frontend).
  - **Cannot** view profile (`/me`), place orders, or access admin panels.
- **Middleware:** Requests often go through `optionalAuth` where `req.user` remains `undefined`.

### B. Authenticated User (Real User)
- **Identification:** A valid JWT token is provided in the `Authorization: Bearer <TOKEN>` header.
- **Access Level:** Full (based on role).
- **Permissions:**
  - All Guest permissions.
  - Can view/update their profile (`/me`).
  - Can place orders and view order history.
  - Can manage their own shipping addresses and preferences.
- **Middleware:** Requests go through `protect` (or `requireAuth`) which ensures `req.user` is populated.

---

## 2. Roles (Admin vs User)

Once authenticated, the user can have different roles:
- **`user`:** Standard customer permissions.
- **`admin`:** Full administrative access, including product management, order tracking for all users, and system settings. Access is controlled by the `admin` middleware.

---

## 3. Login Flow (Client to Server)

The application uses **JWT (JSON Web Token)** for authentication. The process is stateless.

### Steps:
1. **Request:** User sends their `email` and `password` via the `/api/auth/login` endpoint.
2. **Validation:** 
   - Server checks if the user exists in the database.
   - Server compares the provided password with the hashed password in the DB.
3. **Token Generation:** 
   - If valid, the server generates a JWT signed with `JWT_SECRET`.
4. **Response:** 
   - Server sends the JWT and User data back to the client.
5. **Storage:** 
   - The frontend stores the token in `localStorage` or `cookies`.

---

## 4. Authenticated Request Flow

Once logged in, the client must include the token in every request that requires authentication.

### Steps:
1. **Request Header:** The client adds the token: `Authorization: Bearer <JWT_TOKEN>`
2. **Middleware (Protect):**
   - Extracts the token and verifies it.
   - Attaches the user object to the request (`req.user`).
3. **Route Execution:** The controller processes the request using `req.user`.

---

## 5. Logout Flow

Logout is handled primarily by the client by removing the token.

### Steps:
1. **Client-Side:**
   - Frontend removes the JWT token from storage.
   - Application state is cleared.
   - User is redirected to the Login or Home page.
2. **Server-Side:**
   - No explicit API call required as the server is stateless.

---

## 6. Error Handling & Token Expiration

- **Invalid Token:** Returns `401 Unauthorized`.
- **Expired Token:** Returns `401 Unauthorized`. Client should clear local token and redirect to login.
- **Unauthorized Access:** If a standard user tries to access admin routes, returns `403 Forbidden`.
