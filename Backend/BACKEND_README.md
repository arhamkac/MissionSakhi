# Mission Sakhi - Backend Documentation

## Overview
Mission Sakhi is a comprehensive backend API for a community-driven platform designed to provide support, forums, and AI-powered chatbot services. The backend is built with **Express.js**, **MongoDB**, and **Socket.io** for real-time communication.

---

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Environment variables configured in `.env`

### Installation & Running

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:8000` by default.

---

## Project Structure

```
Backend/
├── controllers/       # Business logic for each feature
├── routes/           # API endpoints
├── models/           # MongoDB schemas
├── middleware/       # Authentication, file upload, OTP
├── utils/            # Helper functions and error handling
├── db/               # Database connection
├── chatbot/          # AI chatbot implementation
├── public/           # Static files
└── app.js           # Express app setup & Socket.io
```

---

## Core Features & APIs

### 1. **User Authentication & Management**
**File:** `controllers/user.controller.js` | `routes/user.routes.js`

#### Features:
- User registration and login
- JWT-based authentication (access & refresh tokens)
- OTP verification for password reset
- Google OAuth login
- Password change & reset
- Get current user profile

#### API Endpoints:

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| POST | `/auth/logout` | ✅ | Logout user |
| POST | `/auth/refresh-access-token` | ❌ | Refresh JWT token |
| POST | `/auth/change-password` | ✅ | Change password |
| POST | `/auth/send-otp` | ❌ | Send OTP to email |
| POST | `/auth/verify-otp` | ❌ | Verify OTP |
| POST | `/auth/reset-password` | ❌ | Reset password with OTP |
| POST | `/auth/login/google` | ❌ | Google OAuth login |
| GET | `/auth/me` | ✅ | Get current user info |

**Key Logic:**
- Passwords hashed with bcrypt before storage
- Accounts can be temporarily banned (blocked emails)
- OTP-based account recovery

---

### 2. **Posts & Community Forum**
**File:** `controllers/post.controller.js` | `routes/post.routes.js`

#### Features:
- Create posts with title, content, and categories
- Upload images with posts (via Cloudinary)
- Edit and delete posts (owner only)
- Fetch posts with pagination
- Content moderation using Google Perspective API (checks toxicity, profanity, threats, etc.)
- Posts must have non-empty title and content

#### API Endpoints:

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/posts/upload-post` | ✅ | Create new post with image |
| PATCH | `/posts/update-post/:postId` | ✅ | Update post (owner only) |
| DELETE | `/posts/delete-post/:postId` | ✅ | Delete post (owner only) |
| GET | `/posts/get-post/:postId` | ❌ | Get single post details |
| GET | `/posts/get-posts` | ❌ | Get all posts (paginated) |

**Key Logic:**
- Content safety: Posts are checked for toxicity, explicit content, threats, insults, and profanity
- If scores exceed thresholds, post is rejected
- Images stored on Cloudinary cloud
- Owner verification for edit/delete operations

---

### 3. **Comments System**
**File:** `controllers/comment.controller.js` | `routes/comment.routes.js`

#### Features:
- Post comments on any post
- Edit own comments
- Delete own comments
- Fetch all comments for a post
- Content moderation on comments

#### API Endpoints:

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/comments/post/:postId` | ✅ | Post comment on a post |
| PATCH | `/comments/post/:commentId` | ✅ | Update comment (owner only) |
| DELETE | `/comments/delete/:commentId` | ✅ | Delete comment (owner only) |
| GET | `/comments/getcomments/:postId` | ❌ | Get all comments for a post |

**Key Logic:**
- Comments undergo safety checks like posts
- Only comment author can edit/delete
- Comments linked to specific posts

---

### 4. **Voting System (Upvote/Downvote)**
**File:** `controllers/vote.controller.js` | `routes/vote.routes.js`

#### Features:
- Toggle upvote/downvote on posts
- Toggle upvote/downvote on comments
- One vote per user per item (replaces previous vote)

#### API Endpoints:

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/votes/toggle-post-vote/:postId` | ✅ | Toggle post vote |
| POST | `/votes/toggle-comment-vote/:commentId` | ✅ | Toggle comment vote |

**Key Logic:**
- Users can upvote, downvote, or remove vote
- Previous vote is deleted if changing vote type
- Vote counts affect post ranking

---

### 5. **Real-time Chat & Messaging**
**File:** `controllers/room.controller.js` | `controllers/message.controller.js` | `routes/room.routes.js` | `routes/message.routes.js`

#### Features:
- Create chat rooms
- Join chat rooms
- Send real-time messages using Socket.io
- Edit and delete messages
- Fetch room messages
- Delete rooms (admin only)

#### API Endpoints:

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/rooms/create-room` | ✅ | Create new chat room |
| GET | `/rooms/get-rooms` | ❌ | Get all available rooms |
| GET | `/rooms/:roomId` | ❌ | Get room details |
| POST | `/rooms/:roomId` | ✅ | Join a room |
| DELETE | `/rooms/:roomId` | ✅ | Delete room (admin only) |
| GET | `/rooms/messages/:roomId` | ✅ | Get all messages in room |
| PATCH | `/messages/:messageId` | ✅ | Edit message (sender only) |
| DELETE | `/messages/:messageId` | ✅ | Delete message (sender only) |

**Socket.io Events:**
```javascript
socket.on('join room', (roomId))  // Join a room
socket.on('send message', (data)) // Send message in room
```

**Key Logic:**
- Messages are stored in database with timestamps
- Room admin can delete the entire room
- Socket.io handles real-time message broadcasting
- Messages checked for safety before sending

---

### 6. **Reporting & Moderation**
**File:** `controllers/report.controller.js` | `routes/report.routes.js`

#### Features:
- Report inappropriate posts, comments, messages, rooms, or users
- Automatic account banning after threshold of reports
- Report tracking and history

#### API Endpoints:

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/reports/:postId` | ✅ | Report a post |
| POST | `/reports/:commentId` | ✅ | Report a comment |
| POST | `/reports/:messageId` | ✅ | Report a message |
| POST | `/reports/:userId` | ✅ | Report a user |
| POST | `/reports/:roomId` | ✅ | Report a room |

**Key Logic:**
- Reports accumulate against users
- After multiple reports, user email is blocked (banned)
- Bans are temporary (bannedTill timestamp)
- Helps maintain community safety

---

## Database Models

### User
```javascript
{
  username: String,
  email: String (required, unique),
  password: String (hashed),
  nickname: String,
  picture: String (profile image URL),
  joinedGroups: [ObjectId],
  OTPVerified: Boolean,
  googleId: String (for OAuth),
  provider: String (local/google),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Post
```javascript
{
  title: String (required),
  content: String (required),
  image: String (Cloudinary URL),
  category: [String],
  owner: ObjectId (User),
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```javascript
{
  content: String (required),
  post: ObjectId (Post),
  postedBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Vote
```javascript
{
  owner: ObjectId (User),
  post: ObjectId (Post),
  comment: ObjectId (Comment),
  upvote: Boolean,
  downvote: Boolean,
  createdAt: Date
}
```

### Room
```javascript
{
  name: String (required),
  description: String,
  admin: ObjectId (User),
  members: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  sender: ObjectId (User),
  content: String,
  group: ObjectId (Room),
  createdAt: Date,
  updatedAt: Date
}
```

### Report
```javascript
{
  reportedBy: ObjectId (User),
  reportedUser: ObjectId (User),
  type: String,
  content: String,
  post: ObjectId,
  comment: ObjectId,
  message: ObjectId,
  room: ObjectId,
  createdAt: Date
}
```

---

## Middleware

### 1. **Authentication Middleware** (`auth.middleware.js`)
- Validates JWT tokens
- Protects routes requiring authentication
- Extracts user info from token

### 2. **File Upload Middleware** (`multer.middleware.js`)
- Handles image uploads
- Supports multiple file formats
- Stores files temporarily for Cloudinary upload

### 3. **OTP Middleware** (`otp.middleware.js`)
- Generates OTP (One-Time Password)
- Sends OTP via email using Nodemailer
- Validates OTP for account recovery

---

## Utility Functions

### ApiResponse (`utils/ApiResponse.js`)
Standardized success response format:
```javascript
new ApiResponse(statusCode, data, message)
```

### ApiError (`utils/ApiError.js`)
Standardized error response format:
```javascript
throw new ApiError(statusCode, message, error)
```

### AsyncHandler (`utils/asyncHandler.js`)
Wraps async route handlers to catch errors automatically:
```javascript
const myController = asyncHandler(async(req, res) => { ... })
```

### Cloudinary (`utils/cloudinary.js`)
- Upload images to Cloudinary cloud storage
- Delete images from Cloudinary
- Returns secure URLs for stored images

---

## Content Moderation

The system uses **Google Perspective API** to check content safety:

**Checked Attributes:**
- TOXICITY (threshold: 0.6)
- SEXUALLY_EXPLICIT (threshold: 0.5)
- THREAT (threshold: 0.5)
- INSULT (threshold: 0.5)
- PROFANITY (threshold: 0.5)

**Applied to:**
- Post titles & content
- Comments
- Messages

If content exceeds thresholds, it's rejected with error message.

---

## Environment Variables

Create a `.env` file with:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/sakhiverse
CORS_ORIGIN=http://localhost:5173

# JWT
JWT_ACCESS_TOKEN_SECRET=your_secret_here
JWT_REFRESH_TOKEN_SECRET=your_secret_here
JWT_ACCESS_TOKEN_EXPIRY=7d
JWT_REFRESH_TOKEN_EXPIRY=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Perspective API (Content Moderation)
PERSPECTIVE_API_KEY=your_perspective_api_key
```

---

## Error Handling

All errors follow a standard format:
```javascript
{
  statusCode: number,
  message: string,
  success: false,
  data: null
}
```

Common error codes:
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid auth)
- **404**: Not Found
- **500**: Server Error

---

## Authentication Flow

1. **Register**: User provides email, nickname, password
2. **Login**: User provides email & password, receives access + refresh tokens
3. **Protected Routes**: Include JWT token in `Authorization` header: `Bearer <token>`
4. **Token Refresh**: Use refresh token to get new access token when expired
5. **Logout**: User's refresh token is cleared from database

---

## Real-time Features (Socket.io)

- Users can join chat rooms in real-time
- Messages are broadcasted to all room members instantly
- Connection tracking with unique socket IDs
- Graceful disconnection handling

---

## Key Technologies

- **Express.js**: Web framework
- **MongoDB + Mongoose**: Database
- **Socket.io**: Real-time communication
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Cloudinary**: Image storage
- **Nodemailer**: Email service
- **Google APIs**: OAuth & content moderation
- **Multer**: File uploads
- **Helmet**: Security headers
- **CORS**: Cross-origin requests

---

## Performance & Security

✅ **Security Features:**
- Bcrypt password hashing
- JWT token-based authentication
- CORS protection
- Helmet headers for security
- Content moderation on user inputs
- Email verification for sensitive operations
- Account blocking for abusive users

✅ **Performance Features:**
- Mongoose pagination support
- Indexed database queries
- Cloud-based image storage
- Real-time messaging with Socket.io

---

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

**JWT Token Expired:**
- Use `/auth/refresh-access-token` endpoint with refresh token

**Image Upload Failed:**
- Verify Cloudinary credentials
- Check file size limits

**Socket.io Connection Issues:**
- Ensure CORS is properly configured
- Check client-side socket connection setup

---

## Next Steps for First-Time Users

1. **Set up environment variables** - Copy `.env.example` to `.env`
2. **Install dependencies** - Run `npm install`
3. **Start the server** - Run `npm run dev`
4. **Test APIs** - Use Postman or similar tool
5. **Connect frontend** - Configure frontend to point to backend URL
6. **Enable Socket.io** - Ensure frontend subscribes to real-time events

---

## Support & Questions

For issues or questions, refer to:
- API documentation in `API.md`
- Individual controller files for detailed logic
- Test endpoints using Postman/Insomnia

**Last Updated:** January 2026
