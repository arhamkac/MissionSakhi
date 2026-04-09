# Mission Sakhi — Complete API Reference

> **Who is this for?**  
> Frontend developers, open-source contributors, or anyone who wants to interact with the Mission Sakhi backend — even if you've never worked with an API before. This document explains every available endpoint, what to send, and exactly what you'll get back.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Base URLs](#base-urls)
3. [Standard Response Format](#standard-response-format)
4. [Authentication Overview](#authentication-overview)
5. [Data Schemas](#data-schemas)
6. [API Endpoints](#api-endpoints)
   - [🔐 Users / Auth](#-users--auth---apiusers)
   - [📝 Posts](#-posts---apiposts)
   - [💬 Comments](#-comments---apicomment)
   - [👍 Votes](#-votes---apivote)
   - [🏠 Rooms](#-rooms---apirooms)
   - [💭 Messages](#-messages---apimessages)
   - [🚩 Reports](#-reports---apireport)
   - [🤖 Chatbot (Sakhi)](#-chatbot-sakhi---apichatbot)
7. [Error Reference](#error-reference)
8. [Content Moderation Policy](#content-moderation-policy)
9. [Post Categories](#post-categories)
10. [Report Categories](#report-categories)

---

## Quick Start

### What is a REST API?

Think of the API as a waiter at a restaurant. You (the frontend / client) place an order (send an HTTP request), and the waiter goes to the kitchen (the server) and brings back your food (a JSON response).

### Making your first request

```bash
# Example: Get all posts (no login needed)
curl https://missionsakhi.onrender.com/api/posts/get-posts
```

Or in JavaScript (browser / Node.js):

```js
const res = await fetch('https://missionsakhi.onrender.com/api/posts/get-posts');
const data = await res.json();
console.log(data);
```

---

## Base URLs

| Environment | URL |
|-------------|-----|
| **Production** | `https://missionsakhi.onrender.com/api` |
| **Local dev** | `http://localhost:8080/api` |

All paths below are **relative** to the base URL. For example, `/users/login` means:  
`https://missionsakhi.onrender.com/api/users/login`

---

## Standard Response Format

Every successful response follows the same envelope:

```json
{
  "statusCode": 200,
  "message": "<data object or string>",
  "success": true
}
```

> **Note:** The actual data you care about lives inside the `"message"` field. This is an intentional design choice in this project — many APIs use `"data"` instead, but here it's `"message"`.

### Example — Successful login:

```json
{
  "statusCode": 200,
  "message": {
    "user": { "_id": "664abc...", "email": "user@example.com", "nickname": "SafeSister" },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "success": true
}
```

---

## Authentication Overview

Mission Sakhi uses **JWT (JSON Web Tokens)** for authentication.

### How it works — step by step:

```
1. Call POST /api/users/login  →  receive { accessToken, refreshToken }
2. Store the accessToken (e.g. in localStorage or React state)
3. For every protected route, attach: Authorization: Bearer <accessToken>
4. Access tokens expire — when you get a 401, call POST /api/users/refresh-access-token
5. To log out, call POST /api/users/logout
```

### Which routes need auth?

- 🔒 = **Protected** — you must send `Authorization: Bearer <accessToken>`
- 🔓 = **Public** — no token needed

### How to attach the token in JavaScript:

```js
const token = localStorage.getItem('accessToken');

const res = await fetch('https://missionsakhi.onrender.com/api/posts/get-user-posts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

> **Pro tip:** Cookies (`accessToken` + `refreshToken`) are also set as **HttpOnly** cookies on login. If you're building a same-origin frontend, cookies work automatically — no need to manually attach the header.

---

## Data Schemas

These are the shapes of objects you'll encounter in responses.

### User Object

```json
{
  "_id": "664abc123...",          // MongoDB ObjectId (string)
  "username": "BraveOwl742",      // Auto-generated if not provided
  "email": "user@example.com",
  "nickname": "SafeSister",       // Display name (can be null)
  "picture": "https://...",       // Profile picture URL (Google users only)
  "provider": "local",            // "local" | "google"
  "joinedGroups": "664xyz...",    // Room ObjectId
  "createdAt": "2024-05-20T10:00:00.000Z",
  "updatedAt": "2024-05-20T10:00:00.000Z"
}
```

> **Note:** `password` and `refreshToken` are **never** included in responses.

---

### Post Object

```json
{
  "_id": "664def456...",
  "title": "How I handled street harassment",
  "content": "Last week I was walking home...",
  "image": "https://res.cloudinary.com/...",   // null if no image uploaded
  "category": ["Womens Safety", "Mental Health & Wellness"],
  "owner": "664abc123...",                     // User ObjectId
  "upvotes": 12,                               // Computed on aggregated fetches
  "downvotes": 2,                              // Computed on aggregated fetches
  "comments": [ /* Comment objects */ ],        // Included in aggregated fetches
  "createdAt": "2024-05-20T10:00:00.000Z",
  "updatedAt": "2024-05-20T10:00:00.000Z"
}
```

---

### Comment Object

```json
{
  "_id": "664ghi789...",
  "content": "Thank you for sharing this. You are so brave.",
  "post": "664def456...",     // Post ObjectId
  "postedBy": "664abc123...", // User ObjectId
  "owner": {                  // Populated in GET requests
    "_id": "664abc123...",
    "username": "BraveOwl742",
    "nickname": "SafeSister"
  },
  "createdAt": "2024-05-20T11:00:00.000Z",
  "updatedAt": "2024-05-20T11:00:00.000Z"
}
```

---

### Room Object

```json
{
  "_id": "664jkl012...",
  "name": "Mental Health Support",
  "description": "A safe space to talk about mental health.",
  "admin": "664abc123...",         // User ObjectId who created the room
  "members": ["664abc123...", "664mno345..."],  // Array of User ObjectIds
  "createdAt": "2024-05-20T09:00:00.000Z",
  "updatedAt": "2024-05-20T09:00:00.000Z"
}
```

---

### Message Object

```json
{
  "_id": "664pqr678...",
  "group": "664jkl012...",     // Room ObjectId
  "sender": {                  // Populated sender info
    "_id": "664abc123...",
    "username": "BraveOwl742",
    "nickname": "SafeSister"
  },
  "content": "Hello everyone 🌸",
  "createdAt": "2024-05-20T12:00:00.000Z",
  "updatedAt": "2024-05-20T12:00:00.000Z"
}
```

---

### Paginated Response (Posts / Rooms / Comments)

When you fetch a list, you get a paginated wrapper:

```json
{
  "statusCode": 200,
  "message": {
    "posts": [ /* array of Post objects */ ],   // key is "rooms" / "comments" depending on endpoint
    "totalDocs": 87,
    "limit": 10,
    "page": 1,
    "totalPages": 9,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "success": true
}
```

---

## API Endpoints

---

## 🔐 Users / Auth — `/api/users`

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | 🔓 | Create a new account |
| `POST` | `/login` | 🔓 | Login with email + password |
| `POST` | `/logout` | 🔒 | Logout and clear auth cookies |
| `POST` | `/refresh-access-token` | 🔓 | Get a new access token |
| `GET`  | `/me` | 🔒 | Get the current logged-in user |
| `PUT`  | `/profile` | 🔒 | Update profile (nickname, username) |
| `POST` | `/change-password` | 🔒 | Change password (while logged in) |
| `POST` | `/login/google` | 🔓 | Login or register via Google (Firebase) |
| `POST` | `/send-otp` | 🔓 | Send a password-reset OTP to email |
| `POST` | `/verify-otp` | 🔓 | Verify the OTP code |
| `POST` | `/reset-password` | 🔓 | Set a new password after OTP verification |

---

### `POST /api/users/register`

Creates a new user account.

**Request Body** (`application/json`):

```json
{
  "email": "user@example.com",      // required
  "password": "secure123",          // required
  "nickname": "SafeSister",         // optional — display name
  "username": "safesister"          // optional — auto-generated if omitted
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664abc123...",
    "email": "user@example.com",
    "nickname": "SafeSister",
    "username": "safesister",
    "createdAt": "2024-05-20T10:00:00.000Z"
  },
  "success": true
}
```

**Error cases:**
- `400` — Email already registered
- `400` — Account banned (email on block list)
- `400` — Missing required fields

---

### `POST /api/users/login`

Authenticates a user and returns tokens.

**Request Body** (`application/json`):

```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "user": {
      "_id": "664abc123...",
      "email": "user@example.com",
      "nickname": "SafeSister",
      "username": "BraveOwl742"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "success": true
}
```

> **Cookies:** Two HttpOnly cookies are also set — `accessToken` and `refreshToken`. If your frontend is on the same domain, these cookies are sent automatically on every subsequent request.

**Error cases:**
- `400` — No user with that email
- `400` — Incorrect password
- `400` — Account temporarily banned

---

### `POST /api/users/logout`

🔒 **Requires auth.**

Clears the auth cookies and invalidates the refresh token.

**Request Body:** _(empty)_

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

---

### `POST /api/users/refresh-access-token`

Use this when your access token expires (you receive a `401`). The refresh token is read from the `refreshToken` **cookie** or from the request body.

**Request Body** (optional — only if not using cookies):

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "success": true
}
```

> **Note:** Both a new access token AND a new refresh token are issued. Update both in your storage.

---

### `GET /api/users/me`

🔒 **Requires auth.**

Returns the full profile of the currently authenticated user.

**Request Body:** _(none)_

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664abc123...",
    "email": "user@example.com",
    "username": "BraveOwl742",
    "nickname": "SafeSister",
    "picture": null,
    "provider": "local",
    "createdAt": "2024-05-20T10:00:00.000Z"
  },
  "success": true
}
```

---

### `PUT /api/users/profile`

🔒 **Requires auth.**

Update the logged-in user's profile fields.

**Request Body** (`application/json`):

```json
{
  "username": "new_username",    // optional
  "nickname": "New Nickname"     // optional
}
```

> Send only the fields you want to change. All fields are optional but at least one should be present.

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664abc123...",
    "username": "new_username",
    "nickname": "New Nickname",
    "email": "user@example.com"
  },
  "success": true
}
```

---

### `POST /api/users/change-password`

🔒 **Requires auth.**

Change the password while the user is logged in (knows their current password).

**Request Body** (`application/json`):

```json
{
  "oldPassword": "secure123",
  "newPassword": "evenMoreSecure456"
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

---

### `POST /api/users/login/google`

Login or create an account using Google (Firebase OAuth). Your frontend should use Firebase's `signInWithPopup` or `signInWithRedirect`, then send the resulting Firebase ID token here.

**Request Body** (`application/json`):

```json
{
  "tokenId": "<Firebase ID Token from signInWithPopup>"
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "user": {
      "id": "664abc123...",
      "email": "user@gmail.com",
      "username": "Jane Doe",
      "picture": "https://lh3.googleusercontent.com/..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "success": true
}
```

> If the user's Google email is already registered as a local account, it will be linked to the Google provider.

---

### Forgot Password Flow (3 steps)

#### Step 1 — `POST /api/users/send-otp`

Sends a one-time password (OTP) to the user's email. Valid for **5 minutes**.

**Request Body** (`application/json`):

```json
{
  "emailId": "user@example.com"
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

---

#### Step 2 — `POST /api/users/verify-otp`

Verify the OTP the user received by email.

**Request Body** (`application/json`):

```json
{
  "emailId": "user@example.com",
  "receivedOTP": 847291
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

**Error cases:**
- `400` — OTP is wrong
- `400` — OTP has expired (5-minute window passed)

---

#### Step 3 — `POST /api/users/reset-password`

Set a new password. **Only works after Step 2 is completed.**

**Request Body** (`application/json`):

```json
{
  "emailId": "user@example.com",
  "newPassword": "newSecurePassword789"
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

---

## 📝 Posts — `/api/posts`

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload-post` | 🔒 | Create a new post |
| `GET`  | `/get-posts` | 🔓 | Get all posts (paginated) |
| `GET`  | `/get-post/:postId` | 🔓 | Get a single post by ID |
| `PATCH` | `/update-post/:postId` | 🔒 | Edit a post |
| `DELETE` | `/delete-post/:postId` | 🔒 | Delete a post |
| `GET`  | `/get-user-posts` | 🔒 | Get the logged-in user's posts |

> **Content Moderation:** All post content is screened by **Perspective AI** before saving. Posts with high toxicity, profanity, threats, or sexual content are rejected with `400`.

---

### `POST /api/posts/upload-post`

🔒 **Requires auth.**

Creates a new post. Use `multipart/form-data` (required if uploading an image).

**Request** (`multipart/form-data`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Title of the post |
| `content` | string | ✅ | Main body text |
| `category` | JSON string | ✅ | Array of categories, e.g. `'["Womens Safety"]'` |
| `image` | file | ❌ | Optional image attachment |

> **Why JSON string for category?** Because `multipart/form-data` only supports strings and files, you must serialize the array: `JSON.stringify(["Womens Safety", "Mental Health & Wellness"])`.

**JavaScript Example:**

```js
const formData = new FormData();
formData.append('title', 'My story');
formData.append('content', 'Here is what happened...');
formData.append('category', JSON.stringify(['Womens Safety']));
formData.append('image', fileInput.files[0]); // optional

const res = await fetch('/api/posts/upload-post', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664def456...",
    "title": "My story",
    "content": "Here is what happened...",
    "image": "https://res.cloudinary.com/...",
    "category": ["Womens Safety"],
    "owner": "664abc123...",
    "createdAt": "2024-05-20T10:00:00.000Z"
  },
  "success": true
}
```

---

### `GET /api/posts/get-posts`

🔓 **Public.** Fetch all posts with upvote/downvote counts and comments.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number for pagination |
| `limit` | number | `10` | Number of posts per page |
| `query` | string | — | Search by post title |
| `sortBy` | string | `createdAt` | Field to sort by |
| `sortType` | string | `desc` | `asc` or `desc` |

**Example:**

```
GET /api/posts/get-posts?page=1&limit=5&query=harassment&sortType=desc
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "posts": [
      {
        "_id": "664def456...",
        "title": "How I handled street harassment",
        "content": "Last week I was walking home...",
        "image": null,
        "category": ["Womens Safety"],
        "owner": "664abc123...",
        "upvotes": 12,
        "downvotes": 2,
        "comments": [
          { "_id": "...", "content": "Stay strong!", "postedBy": "..." }
        ],
        "createdAt": "2024-05-20T10:00:00.000Z"
      }
    ],
    "totalDocs": 87,
    "limit": 10,
    "page": 1,
    "totalPages": 9,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "success": true
}
```

---

### `GET /api/posts/get-post/:postId`

🔓 **Public.** Get a single post by its ID, including full comments and vote counts.

**URL Parameter:** `:postId` — The MongoDB ObjectId of the post.

**Example:**

```
GET /api/posts/get-post/664def456abc123
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664def456...",
    "title": "How I handled street harassment",
    "content": "Last week I was walking home...",
    "image": null,
    "category": ["Womens Safety"],
    "owner": "664abc123...",
    "upvotes": 12,
    "downvotes": 2,
    "comments": [
      {
        "_id": "664ghi789...",
        "content": "Thank you for sharing.",
        "postedBy": "664xyz...",
        "postedByUser": { "username": "BraveOwl742", "nickname": "SafeSister" }
      }
    ],
    "createdAt": "2024-05-20T10:00:00.000Z"
  },
  "success": true
}
```

---

### `PATCH /api/posts/update-post/:postId`

🔒 **Requires auth.** Only the post **owner** can update it.

**URL Parameter:** `:postId`

**Request Body** (`application/json`) — send only the fields you want to change:

```json
{
  "title": "Updated title",    // optional
  "content": "Updated body"    // optional
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664def456...",
    "title": "Updated title",
    "content": "Updated body",
    "category": ["Womens Safety"],
    "owner": "664abc123..."
  },
  "success": true
}
```

**Error cases:**
- `400` — You are not the owner of this post
- `400` — Content flagged by Perspective AI

---

### `DELETE /api/posts/delete-post/:postId`

🔒 **Requires auth.** Only the post **owner** can delete it.

**URL Parameter:** `:postId`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

> If the post had an image uploaded to Cloudinary, it is automatically deleted too.

---

### `GET /api/posts/get-user-posts`

🔒 **Requires auth.** Returns all posts by the currently logged-in user.

**Query Parameters:** Same as `get-posts` (`page`, `limit`, `query`, `sortBy`, `sortType`).

**Success Response** `200`: Same shape as `get-posts` but only showing the current user's posts.

---

## 💬 Comments — `/api/comment`

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/post/:postId` | 🔒 | Add a comment to a post |
| `PATCH` | `/update/:commentId` | 🔒 | Edit your comment |
| `DELETE` | `/delete/:commentId` | 🔒 | Delete your comment |
| `GET` | `/getcomments/:postId` | 🔓 | Get all comments for a post |

> **Content Moderation:** Comments are screened by Perspective AI before saving.

---

### `POST /api/comment/post/:postId`

🔒 **Requires auth.**

**URL Parameter:** `:postId` — the ID of the post you're commenting on.

**Request Body** (`application/json`):

```json
{
  "content": "This helped me so much, thank you."
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664ghi789...",
    "content": "This helped me so much, thank you.",
    "post": "664def456...",
    "postedBy": "664abc123...",
    "createdAt": "2024-05-20T11:00:00.000Z"
  },
  "success": true
}
```

---

### `PATCH /api/comment/update/:commentId`

🔒 **Requires auth.** Only the comment **author** can update it.

**URL Parameter:** `:commentId`

**Request Body** (`application/json`):

```json
{
  "content": "Updated comment text."
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664ghi789...",
    "content": "Updated comment text.",
    "post": "664def456...",
    "postedBy": "664abc123..."
  },
  "success": true
}
```

---

### `DELETE /api/comment/delete/:commentId`

🔒 **Requires auth.** Only the comment **author** can delete it.

**URL Parameter:** `:commentId`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

---

### `GET /api/comment/getcomments/:postId`

🔓 **Public.** Returns all comments for a post, with the author's username and nickname populated.

**URL Parameter:** `:postId`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "comments": [
      {
        "_id": "664ghi789...",
        "content": "Thank you for sharing.",
        "post": "664def456...",
        "postedBy": "664abc123...",
        "owner": [
          { "_id": "664abc123...", "username": "BraveOwl742", "nickname": "SafeSister" }
        ],
        "createdAt": "2024-05-20T11:00:00.000Z"
      }
    ],
    "totalDocs": 5,
    "page": 1,
    "limit": 10
  },
  "success": true
}
```

---

## 👍 Votes — `/api/vote`

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/toggle-post-vote/:postId` | 🔒 | Upvote or downvote a post |
| `POST` | `/toggle-comment-vote/:commentId` | 🔒 | Upvote or downvote a comment |

**Query parameter `?vote`:**
- `?vote=true` → **Upvote**
- `?vote=false` → **Downvote**

**Toggle behavior:**  
Calling the same vote type again **removes** the vote (toggle off). Switching from upvote to downvote first removes the existing vote, then you must call again to add the new direction.

---

### `POST /api/vote/toggle-post-vote/:postId?vote=true`

🔒 **Requires auth.**

**URL Parameter:** `:postId`  
**Query Param:** `?vote=true` for upvote, `?vote=false` for downvote

**Example:**

```
POST /api/vote/toggle-post-vote/664def456?vote=true
Authorization: Bearer eyJ...
```

**Success Response — Vote added** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664stu901...",
    "owner": "664abc123...",
    "post": "664def456...",
    "upvote": true,
    "downvote": false
  },
  "success": true
}
```

**Success Response — Vote removed (toggled off)** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

---

### `POST /api/vote/toggle-comment-vote/:commentId?vote=true`

🔒 **Requires auth.** Same behavior as post votes but for comments.

**URL Parameter:** `:commentId`  
**Query Param:** `?vote=true` or `?vote=false`

**Success Response:** Same shape as post vote response above.

---

## 🏠 Rooms — `/api/rooms`

Rooms are group chat spaces that users can create, join, and send messages in.

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/get-rooms` | 🔓 | List all rooms (paginated) |
| `POST` | `/create-room` | 🔒 | Create a new room |
| `GET` | `/:roomId` | 🔓 | Get details of a specific room |
| `DELETE` | `/:roomId` | 🔒 | Delete a room (admin only) |
| `POST` | `/:roomId` | 🔒 | Join a room |
| `GET` | `/messages/:roomId` | 🔓 | Get all messages in a room |

---

### `GET /api/rooms/get-rooms`

🔓 **Public.** Returns a paginated list of all rooms.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Rooms per page |
| `query` | string | — | Search by room name |

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "rooms": [
      {
        "_id": "664jkl012...",
        "name": "Mental Health Support",
        "description": "A safe space to talk.",
        "admin": "664abc123...",
        "members": ["664abc123..."],
        "createdAt": "2024-05-20T09:00:00.000Z"
      }
    ],
    "totalRooms": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  },
  "success": true
}
```

---

### `POST /api/rooms/create-room`

🔒 **Requires auth.**

**Request Body** (`application/json`):

```json
{
  "name": "Legal Help Circle",               // required — must be unique
  "description": "Ask questions about your rights."  // required
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664jkl012...",
    "name": "Legal Help Circle",
    "description": "Ask questions about your rights.",
    "admin": "664abc123...",
    "members": [],
    "createdAt": "2024-05-20T09:00:00.000Z"
  },
  "success": true
}
```

---

### `GET /api/rooms/:roomId`

🔓 **Public.** Get details of a specific room.

**URL Parameter:** `:roomId`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664jkl012...",
    "name": "Mental Health Support",
    "description": "A safe space to talk.",
    "admin": "664abc123...",
    "members": ["664abc123...", "664mno345..."],
    "createdAt": "2024-05-20T09:00:00.000Z"
  },
  "success": true
}
```

---

### `DELETE /api/rooms/:roomId`

🔒 **Requires auth.**

**URL Parameter:** `:roomId`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": { /* deleted room object */ },
  "success": true
}
```

---

### `POST /api/rooms/:roomId`

🔒 **Requires auth.** Join a room. The user's ID is added to the room's `members` array.

**URL Parameter:** `:roomId`  
**Request Body:** _(empty)_

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

**Error cases:**
- `404` — User is already a member of this room

---

### `GET /api/rooms/messages/:roomId`

🔓 **Public.** Get all messages in a room, sorted oldest → newest, with sender info populated.

**URL Parameter:** `:roomId`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": [
    {
      "_id": "664pqr678...",
      "group": "664jkl012...",
      "sender": { "_id": "664abc123...", "username": "BraveOwl742", "nickname": "SafeSister" },
      "content": "Hello everyone 🌸",
      "createdAt": "2024-05-20T12:00:00.000Z"
    }
  ],
  "success": true
}
```

---

## 💭 Messages — `/api/messages`

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create/:roomId` | 🔒 | Send a message to a room |
| `PATCH` | `/:messageId` | 🔒 | Edit a message |
| `DELETE` | `/:messageId` | 🔒 | Delete a message |

> **Content Moderation:** All messages are screened by Perspective AI before saving.

---

### `POST /api/messages/create/:roomId`

🔒 **Requires auth.**

**URL Parameter:** `:roomId` — the room to send the message to.

**Request Body** (`application/json`):

```json
{
  "content": "Hello everyone 🌸"
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664pqr678...",
    "group": "664jkl012...",
    "sender": { "_id": "664abc123...", "username": "BraveOwl742", "nickname": "SafeSister" },
    "content": "Hello everyone 🌸",
    "createdAt": "2024-05-20T12:00:00.000Z"
  },
  "success": true
}
```

---

### `PATCH /api/messages/:messageId`

🔒 **Requires auth.** Only the **sender** can edit their own message.

**URL Parameter:** `:messageId`

**Request Body** (`application/json`):

```json
{
  "content": "Corrected message text."
}
```

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664pqr678...",
    "content": "Corrected message text.",
    "group": "664jkl012...",
    "sender": "664abc123..."
  },
  "success": true
}
```

---

### `DELETE /api/messages/:messageId`

🔒 **Requires auth.** Only the **sender** can delete their own message.

**URL Parameter:** `:messageId`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {},
  "success": true
}
```

---

## 🚩 Reports — `/api/report`

Report inappropriate content (posts, comments, or messages).

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/:type/:id` | 🔒 | Report an entity |

---

### `POST /api/report/:type/:id`

🔒 **Requires auth.**

**URL Parameters:**

| Param | Description |
|-------|-------------|
| `:type` | What you're reporting — `post`, `comment`, or `message` |
| `:id` | The MongoDB ObjectId of the item being reported |

**Request Body** (`application/json`):

```json
{
  "type": "Harassment",
  "content": "This user is threatening me in the comments."
}
```

**Report type options:**  
`Abuse` · `Harassment` · `Spam` · `Fake Profile` · `Nudity` · `Hate Speech` · `Mental Health Concern` · `Inappropriate Content` · `Other`

**Success Response** `200`:

```json
{
  "statusCode": 200,
  "message": {
    "_id": "664vwx234...",
    "reportedBy": "664abc123...",
    "user": "664def456...",
    "type": "Harassment",
    "content": "This user is threatening me in the comments.",
    "comment": "664ghi789...",
    "createdAt": "2024-05-20T13:00:00.000Z"
  },
  "success": true
}
```

> **Auto-suspension:** When a user accumulates **5 or more reports**, their email is automatically added to the block list and their account is suspended for **48 hours**. Suspended users cannot register or log in until the ban period ends.

---

## 🤖 Chatbot (Sakhi) — `/api/chatbot`

Sakhi is an AI companion powered by **Groq's `llama-3.3-70b-versatile`** model, specialized in women's safety, mental health, legal rights, and general wellbeing in the Indian context.

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ask` | 🔓 | Ask Sakhi a question |

---

### `POST /api/chatbot/ask`

🔓 **Public** — no login needed.

**Request Body** (`application/json`):

```json
{
  "question": "What should I do if I feel unsafe at home?",
  "history": "User: How do I use the SOS feature?\nSakhi: Go to Settings and enable SOS..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | string | ✅ | The user's current question |
| `history` | string | ❌ | Previous turns of the conversation as a plain string, to give Sakhi context |

**Success Response** `200`:

```json
{
  "answer": "**Feeling unsafe at home** can be distressing. Here are steps you can take:\n\n* **Call 112** (India's emergency number) if you are in immediate danger.\n* **Reach out to a trusted person** — a friend, neighbor, or family member outside the home.\n* **Women's Helpline:** Call **181** (India) for support and guidance.\n * If you're experiencing domestic abuse, organizations like **iCall** (9152987821) or **Snehi** (044-24640050) can help."
}
```

> **Note:** The chatbot response uses a **different format** — it returns `{ "answer": "..." }` directly, not the standard response envelope. Handle this accordingly in your code.

**Error Response:**

```json
{
  "error": "Question is required"
}
```

---

### Chatbot Usage Example in JavaScript:

```js
const res = await fetch('https://missionsakhi.onrender.com/api/chatbot/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'What are my legal rights if I face workplace harassment?'
  })
});

const { answer } = await res.json();
console.log(answer);
```

---

## Error Reference

All error responses follow this format:

```json
{
  "statusCode": 401,
  "message": "Unauthorized request — no token provided",
  "success": false
}
```

| HTTP Code | Meaning | Common Causes |
|-----------|---------|---------------|
| `400` | Bad Request | Missing fields, wrong password, content flagged by moderation, already voted |
| `401` | Unauthorized | Missing or expired JWT access token |
| `403` | Forbidden | You don't own the resource you're trying to modify |
| `404` | Not Found | Resource (post, comment, room) doesn't exist |
| `500` | Server Error | Something unexpected went wrong on our end |

### Handling a 401 in JavaScript:

```js
async function apiRequest(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });

  if (res.status === 401) {
    // Try to refresh the token
    const refresh = await fetch('/api/users/refresh-access-token', { method: 'POST' });
    const { message } = await refresh.json();
    localStorage.setItem('accessToken', message.accessToken);

    // Retry the original request with the new token
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${message.accessToken}`
      }
    });
  }

  return res.json();
}
```

---

## Content Moderation Policy

All user-generated content (posts, comments, messages) is evaluated by **Google's Perspective API** before being saved. Requests that cross any of these thresholds are rejected with `400 Bad Request`:

| Attribute | Threshold |
|-----------|-----------|
| `TOXICITY` | > 60% |
| `SEXUALLY_EXPLICIT` | > 50% |
| `THREAT` | > 50% |
| `INSULT` | > 50% |
| `PROFANITY` | > 50% |

**Error message when flagged:**

```json
{
  "statusCode": 400,
  "message": "Post cannot be uploaded due to potential use of flag keywords and content",
  "success": false
}
```

---

## Post Categories

When creating a post, `category` must be an array containing at least one of the following valid values:

| Category |
|----------|
| `Womens Safety` |
| `Self-Defense & Training` |
| `Legal Help & Rights` |
| `Harassment & Abuse Support` |
| `Mental Health & Wellness` |
| `Health & Hygiene` |
| `Career & Education` |
| `Entrepreneurship & Business` |
| `Relationships & Marriage` |
| `Friendship & Community` |
| `Travel & Safety Tips` |
| `Fitness & Sports` |
| `Parenting & Family` |
| `Self-Love & Confidence` |
| `Fashion & Lifestyle` |
| `Art, Culture & Creativity` |
| `Technology & Learning` |
| `Finance & Money Management` |
| `News & Awareness` |
| `Open Mic (Anything Goes)` |

---

## Report Categories

When filing a report, `type` must be one of:

`Abuse` · `Harassment` · `Spam` · `Fake Profile` · `Nudity` · `Hate Speech` · `Mental Health Concern` · `Inappropriate Content` · `Other`
