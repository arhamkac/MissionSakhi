# Mission Sakhi — API Reference

**Base URL (Production):** `https://missionsakhi.onrender.com/api`  
**Base URL (Local):** `http://localhost:8080/api`

All responses follow this structure:
```json
{
  "statusCode": 200,
  "message": "<data or string>",
  "success": true
}
```

🔒 = Requires `Authorization: Bearer <accessToken>` header

---

## 🔐 Authentication — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | — | Register a new user |
| `POST` | `/login` | — | Login with email + password |
| `POST` | `/logout` | 🔒 | Logout and clear cookies |
| `POST` | `/refresh-access-token` | — | Get new access token using refresh token cookie |
| `GET`  | `/me` | 🔒 | Get the currently authenticated user |
| `PUT`  | `/profile` | 🔒 | Update profile (nickname, bio, avatar, etc.) |
| `POST` | `/change-password` | 🔒 | Change password |
| `POST` | `/login/google` | — | Login/register via Firebase Google OAuth |
| `POST` | `/send-otp` | — | Send OTP email for password reset |
| `POST` | `/verify-otp` | — | Verify OTP code |
| `POST` | `/reset-password` | — | Reset password after OTP verification |

### POST `/register`
```json
// Request body
{
  "email": "user@example.com",
  "password": "secure123",
  "nickname": "SafeSister",
  "username": "safesister"  // optional
}

// Response
{
  "statusCode": 200,
  "message": { "_id": "...", "email": "...", "nickname": "..." },
  "success": true
}
```

### POST `/login`
```json
// Request body
{ "email": "user@example.com", "password": "secure123" }

// Response — also sets HttpOnly cookies
{
  "statusCode": 200,
  "message": {
    "user": { "_id": "...", "email": "...", "nickname": "..." },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### POST `/login/google`
```json
// Request body (Firebase ID token from signInWithPopup)
{ "tokenId": "google_id_token" }
```

---

## 📝 Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload-post` | 🔒 | Create a new post (multipart/form-data) |
| `GET`  | `/get-posts` | — | Get all posts with votes + comments |
| `GET`  | `/get-post/:postId` | — | Get single post with votes + comments |
| `PATCH` | `/update-post/:postId` | 🔒 | Edit a post |
| `DELETE` | `/delete-post/:postId` | 🔒 | Delete a post |
| `GET`  | `/get-user-posts` | 🔒 | Get posts by logged-in user |

### POST `/upload-post` — `multipart/form-data`
| Field | Type | Required |
|-------|------|----------|
| `title` | string | ✅ |
| `content` | string | ✅ |
| `category` | JSON string array | — |
| `image` | file | — |

### GET `/get-posts` — Query params
| Param | Default | Description |
|-------|---------|-------------|
| `page` | 1 | Page number |
| `limit` | 10 | Results per page |
| `query` | — | Search by title |
| `sortBy` | `createdAt` | Sort field |
| `sortType` | `desc` | `asc` or `desc` |

---

## 💬 Comments — `/api/comment`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/post/:postId` | 🔒 | Add a comment to a post |
| `PATCH` | `/update/:commentId` | 🔒 | Edit a comment |
| `DELETE` | `/delete/:commentId` | 🔒 | Delete a comment |
| `GET` | `/getcomments/:postId` | — | Get all comments for a post |

### POST `/post/:postId`
```json
{ "content": "This helped me so much, thank you." }
```

---

## 👍 Votes — `/api/vote`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/toggle-post-vote/:postId?vote=true` | 🔒 | Upvote a post |
| `POST` | `/toggle-post-vote/:postId?vote=false` | 🔒 | Downvote a post |
| `POST` | `/toggle-comment-vote/:commentId?vote=true` | 🔒 | Upvote a comment |

- `?vote=true` = upvote, `?vote=false` = downvote
- Calling the same vote again **toggles it off** (removes vote)

---

## 🏠 Rooms — `/api/rooms`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/get-rooms` | — | List all rooms |
| `POST` | `/create-room` | 🔒 | Create a new room |
| `GET` | `/:roomId` | — | Get room details |
| `DELETE` | `/:roomId` | 🔒 | Delete a room |
| `POST` | `/:roomId` | 🔒 | Join a room |
| `GET` | `/messages/:roomId` | — | Get all messages in a room |

### POST `/create-room`
```json
{ "name": "Mental Health Support", "description": "A safe space to talk" }
```

### GET `/get-rooms` — Query params
| Param | Default | Description |
|-------|---------|-------------|
| `page` | 1 | Page number |
| `limit` | 10 | Results per page |
| `query` | — | Search by room name |

---

## 💭 Messages — `/api/messages`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create/:roomId` | 🔒 | Send a message to a room |
| `PATCH` | `/:messageId` | 🔒 | Edit a message |
| `DELETE` | `/:messageId` | 🔒 | Delete a message |

### POST `/create/:roomId`
```json
{ "content": "Hello everyone 🌸" }
```

All messages are screened by **Perspective AI** before being saved. Content crossing toxicity thresholds is rejected with `400`.

---

## 🚩 Reports — `/api/report`

A single dynamic endpoint handles all report types.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/:type/:id` | 🔒 | Report any entity |

**Valid `:type` values:** `post`, `comment`, `message`

```json
// Request body
{
  "type": "Harassment",      // see categories below
  "content": "This user is threatening me."
}
```

**Report categories:**
`Abuse`, `Harassment`, `Spam`, `Fake Profile`, `Nudity`, `Hate Speech`, `Mental Health Concern`, `Inappropriate Content`, `Other`

> ⚠️ When a user receives **5 or more reports**, their email is automatically added to the block list and they are suspended for **48 hours**.

---

## 🤖 Chatbot — `/api/chatbot`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ask` | — | Ask Sakhi a question |
| `GET` | `/history` | — | Get recent chat history |

### POST `/ask`
```json
// Request
{
  "question": "What should I do if I feel unsafe at home?",
  "history": "Previous conversation as string..."
}

// Response
{
  "answer": "**Feeling unsafe at home** can be distressing. Here are steps you can take:\n\n* **Call 112** (India emergency)..."
}
```

The chatbot uses **Groq's `llama-3.3-70b-versatile`** grounded in a curated CSV of women's safety, legal, and mental health resources. It answers general women's safety questions using its own knowledge when CSV context is insufficient.

---

## ⚠️ Error Responses

| Code | Meaning |
|------|---------|
| `400` | Bad request — missing/invalid fields |
| `401` | Unauthorized — missing or expired JWT |
| `403` | Forbidden — not owner of resource |
| `404` | Not found |
| `500` | Internal server error |

```json
{
  "statusCode": 401,
  "message": "Unauthorized request — no token provided",
  "success": false
}
```

---

## 🔑 Authentication Flow

```
1. POST /api/users/login  →  receives { accessToken, refreshToken }
2. Store accessToken in localStorage
3. Attach to all requests: Authorization: Bearer <accessToken>
4. On 401: POST /api/users/refresh-access-token (uses HttpOnly refreshToken cookie)
5. On logout: POST /api/users/logout  →  clears cookies + remove localStorage token
```
