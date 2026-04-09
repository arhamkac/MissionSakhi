# Mission Sakhi — Backend

This is the backend server for Mission Sakhi, a women's community platform. Built with **Express.js**, **MongoDB**, and **Groq AI**.

---

## Quick Start

```bash
cd Backend
npm install
# create .env (see Environment Variables section below)
npm run dev
```

Server runs on `http://localhost:8080`.

---

## Project Structure

```
Backend/
├── controllers/       # Business logic — one file per feature
├── routes/            # Express route definitions
├── models/            # MongoDB schemas (Mongoose)
├── middleware/        # JWT auth, file upload, OTP
├── utils/             # ApiError, ApiResponse, asyncHandler, cloudinary
├── chatbot/
│   ├── server.js                    # Groq RAG chatbot endpoint
│   └── womens_chatbot_dataset.csv   # Knowledge base
├── db/                # MongoDB connection
└── app.js             # Express setup, middleware, route mounting
```

---

## API Overview

All routes are prefixed with `/api`. 🔒 = requires `Authorization: Bearer <token>` header.

---

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | — | Create a new account |
| POST | `/login` | — | Login, returns tokens |
| POST | `/logout` | 🔒 | Logout, clears cookies |
| GET | `/me` | 🔒 | Get current logged-in user |
| PUT | `/profile` | 🔒 | Update profile (nickname, bio, avatar) |
| POST | `/refresh-access-token` | — | Get new access token using refresh cookie |
| POST | `/change-password` | 🔒 | Change password |
| POST | `/login/google` | — | Login via Firebase Google OAuth |
| POST | `/send-otp` | — | Send OTP email for password reset |
| POST | `/verify-otp` | — | Verify OTP code |
| POST | `/reset-password` | — | Reset password after verification |

**Login response:**
```json
{
  "message": {
    "user": { "_id": "...", "email": "...", "nickname": "..." },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

Tokens are also set as HttpOnly cookies. Passwords are hashed with bcrypt. Banned emails (`BlockedEmail` collection) are rejected at login and register.

---

### Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload-post` | 🔒 | Create a post (multipart/form-data) |
| GET | `/get-posts` | — | All posts with vote counts + comments |
| GET | `/get-post/:postId` | — | Single post with vote counts + comments |
| PATCH | `/update-post/:postId` | 🔒 | Edit post (owner only) |
| DELETE | `/delete-post/:postId` | 🔒 | Delete post (owner only) |
| GET | `/get-user-posts` | 🔒 | Posts by the logged-in user |

`/upload-post` fields (`multipart/form-data`):

| Field | Type | Required |
|-------|------|----------|
| `title` | string | ✅ |
| `content` | string | ✅ |
| `category` | JSON string (array) | — |
| `image` | file | — |

All content is screened by **Google Perspective API** before saving. Toxicity > 0.6, explicit content > 0.5 are rejected with a 400.

---

### Comments — `/api/comment`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/post/:postId` | 🔒 | Add a comment |
| PATCH | `/update/:commentId` | 🔒 | Edit a comment (owner only) |
| DELETE | `/delete/:commentId` | 🔒 | Delete a comment (owner only) |
| GET | `/getcomments/:postId` | — | Get all comments for a post |

---

### Votes — `/api/vote`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/toggle-post-vote/:postId?vote=true` | 🔒 | Upvote a post |
| POST | `/toggle-post-vote/:postId?vote=false` | 🔒 | Downvote a post |
| POST | `/toggle-comment-vote/:commentId?vote=true` | 🔒 | Upvote a comment |

Calling the same vote again removes it (toggle off). Changing from up→down replaces the previous vote.

---

### Rooms — `/api/rooms`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/get-rooms` | — | List all rooms |
| POST | `/create-room` | 🔒 | Create a room (name required, description optional) |
| GET | `/:roomId` | — | Get room details |
| POST | `/:roomId` | 🔒 | Join a room |
| DELETE | `/:roomId` | 🔒 | Delete a room |
| GET | `/messages/:roomId` | — | Get all messages in a room |

---

### Messages — `/api/messages`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create/:roomId` | 🔒 | Send a message |
| PATCH | `/:messageId` | 🔒 | Edit a message (sender only) |
| DELETE | `/:messageId` | 🔒 | Delete a message (sender only) |

All messages are Perspective API screened before saving.

---

### Reports — `/api/report`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:type/:id` | 🔒 | Report any entity |

Valid `:type` values: `post`, `comment`, `message`

```json
{ "type": "Harassment", "content": "Optional description" }
```

Report categories: `Abuse`, `Harassment`, `Spam`, `Fake Profile`, `Nudity`, `Hate Speech`, `Mental Health Concern`, `Inappropriate Content`, `Other`

When a user hits **5 reports**, their email is added to `BlockedEmail` for 48 hours automatically.

---

### Chatbot — `/api/chatbot`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ask` | — | Ask Sakhi a question |
| GET | `/history` | — | Get recent chat history |

```json
// POST /ask
{
  "question": "What are my rights if I face workplace harassment?",
  "history": "Previous conversation text..."
}

// Response
{ "answer": "**Workplace harassment** is covered under..." }
```

Uses **Groq `llama-3.3-70b-versatile`** with a RAG approach — top matching rows from `womens_chatbot_dataset.csv` are injected as context. The model answers from general knowledge when CSV doesn't cover a topic. Responses are formatted in markdown.

---

## Database Models

### User
```js
{ email, password (bcrypt), nickname, username, picture, refreshToken, googleId, provider, joinedGroups }
```

### Post
```js
{ title, content, image (Cloudinary URL), category: [String], owner: User }
```

### Comment
```js
{ content, post: Post, postedBy: User }
```

### Vote
```js
{ owner: User, post: Post, comment: Comment, upvote: Boolean, downvote: Boolean }
```

### Room
```js
{ name, description, admin: User, members: [User] }
```

### Message
```js
{ content, sender: User, group: Room }
```

### Report
```js
{ reportedBy: User, reportedUser: User, type: String, content: String, post, comment, message }
```

### BlockedEmail
```js
{ email, bannedTill: Date }
```

---

## Utility Classes

All controllers use these three utilities:

```js
// Standardized success response
return res.status(200).json(new ApiResponse(200, data, "Success message"));

// Standardized error (triggers global error handler)
throw new ApiError(400, "Descriptive error message");

// Wraps async controller to auto-catch errors — no try/catch needed per route
const myController = asyncHandler(async (req, res) => { ... });
```

---

## Environment Variables

Create `Backend/.env`:

```env
PORT=8080
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/missionsakhi

ACCESS_TOKEN_SECRET=any_long_random_string
REFRESH_TOKEN_SECRET=another_long_random_string
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

GROQ_API_KEY=gsk_...
PERSPECTIVE_API_KEY=your_perspective_key

# Firebase Admin (only needed for Google login)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

## Error Responses

```json
{
  "statusCode": 401,
  "message": "Unauthorized request — no token provided",
  "success": false
}
```

| Code | Meaning |
|------|---------|
| 400 | Bad request — missing or invalid fields |
| 401 | Unauthorized — no or expired token |
| 403 | Forbidden — not the owner of this resource |
| 404 | Not found |
| 500 | Server error |

---

## Troubleshooting

**`MongooseServerSelectionError`** — MongoDB can't connect. Check your `MONGODB_URI` in `.env`.

**`401 Unauthorized` on protected routes** — Make sure you're sending `Authorization: Bearer <token>` in request headers.

**Post upload returns 500** — Check Cloudinary credentials. The image goes to Cloudinary before the post is saved.

**Chatbot returns empty answer** — Check `GROQ_API_KEY` is set and the CSV file exists at `chatbot/womens_chatbot_dataset.csv`.

**Perspective API errors** — If `PERSPECTIVE_API_KEY` is missing, content moderation will fail on all post/comment/message creation. Either set the key or temporarily disable the `checkPost` call in controllers during local development.
