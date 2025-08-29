# Mission Sakhi Backend API

This is the backend for **Mission Sakhi**, a women's safety and community platform.  
It provides authentication, posts, comments, chat rooms, reporting, and chatbot functionality.

---

## 🚀 Base URL
👉 https://missionsakhi.onrender.com

---

## 📌 Authentication (`/api/auth`)

### **POST /register**
Register a new user.

**Response**
```json
{
  "message": "User registered successfully"
}
```

### **POST /login**
Login with email and password.

**Response**
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "userId",
    "username": "exampleUser",
    "email": "example@email.com"
  }
}
```

### **POST /logout** 🔒  
Logs out the user.

### **POST /refresh-access-token**  
Generates a new access token using refresh token.

### **POST /change-password** 🔒  
Change user’s password.

### **POST /send-otp**  
Send OTP for password reset.

### **POST /verify-otp**  
Verify OTP for password reset.

### **POST /reset-password**  
Reset password using verified OTP.

### **POST /login/google**  
Login using Google OAuth.

---

## 📝 Posts (`/api/posts`)

### **POST /upload-post** 🔒  
Upload a new post (with optional image).

**Request Body (multipart/form-data)**  
- `image`: `<file>`  
- `content`: `"Post content"`

### **PATCH /update-post/:postId** 🔒  
Update a post.

### **DELETE /delete-post/:postId** 🔒  
Delete a post.

### **GET /get-post/:postId**  
Get post details.

### **GET /get-posts**  
Get all posts.

---

## 💬 Comments (`/api/comment`)

### **POST /post/:postId**  
Post a comment on a post.

### **PATCH /post/:commentId** 🔒  
Update a comment.

### **DELETE /delete/:commentId** 🔒  
Delete a comment.

### **GET /getcomments/:postId**  
Fetch all comments for a post.

---

## 👍 Votes (`/api/vote`)

### **POST /toggle-post-vote/:postId** 🔒  
Toggle upvote for a post.

### **POST /toggle-comment-vote/:commentId** 🔒  
Toggle upvote for a comment.

---

## 💬 Chat & Rooms (`/api/rooms`)

### **GET /get-rooms**  
Fetch all rooms.

### **POST /create-room** 🔒  
Create a new room.

### **GET /:roomId**  
Get details of a room.

### **DELETE /:roomId** 🔒  
Delete a room.

### **POST /:roomId** 🔒  
Join a room.

### **GET /messages/:roomId** 🔒  
Get messages of a room.

---

## 💭 Messages (`/api/messages`)

### **PATCH /:messageId** 🔒  
Edit a message.

### **DELETE /:messageId** 🔒  
Delete a message.

---

## 🚨 Reports (`/api/report`)

Users can report posts, comments, messages, users, or rooms.

### **POST /:postId** 🔒  
Report a post.

### **POST /:commentId**  
Report a comment.

### **POST /:messageId**  
Report a message.

### **POST /:userId**  
Report a user.

### **POST /:roomId**  
Report a room.

---

## 🤖 Chatbot (`/api/chatbot`)
Handles chatbot-related requests (custom implementation).

---

## ⚠️ Error Responses
- `401 Unauthorized` – Missing or invalid JWT.  
- `403 Forbidden` – Action not allowed.  
- `404 Not Found` – Resource not found.  
- `500 Internal Server Error` – Unexpected error.  

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT + HttpOnly Refresh Tokens  
- **Real-time Chat:** Socket.IO  
- **File Uploads:** Multer  
- **Content Moderation:** Perspective API  

---

✨ You can now test all APIs using **Postman** or directly at:  
👉 https://missionsakhi.onrender.com
