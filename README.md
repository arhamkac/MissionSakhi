# 🌸 Mission Sakhi

**Mission Sakhi** is an open-source, anonymous community platform built specifically for women. It combines a safe anonymous forum, live topic-based chat rooms, and a Groq-powered AI companion trained on women's safety resources — all without asking you to give up your identity.

> Every post, comment, and message is screened in real-time by Google's Perspective AI to block harmful content before it reaches you.

---

## 📸 Screenshots

<div align="center">

### 🏠 Home
<img src="./Images/home.png" alt="Mission Sakhi Home Page" width="800"/>

### 📝 Anonymous Forum
<img src="./Images/forum.png" alt="Anonymous Forum" width="800"/>

### 🤖 AI Chatbot (Sakhi)
<img src="./Images/chatbot.png" alt="Sakhi AI Chatbot" width="800"/>

### 💬 Community Chat Rooms
<img src="./Images/community.png" alt="Community Chat Rooms" width="800"/>

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🕊️ **Truly Anonymous** | Post, comment, and chat without revealing your real identity |
| 📝 **Anonymous Forum** | Create posts by category, upvote/downvote, comment, and share |
| 💬 **Live Chat Rooms** | Topic-based community rooms with real-time messaging |
| 🤖 **Sakhi AI Companion** | Groq-powered (llama-3.3-70b) chatbot trained on women's safety, legal rights, mental health data |
| 🛡️ **Auto-Moderation** | Every piece of content screened by Google Perspective AI |
| 🚩 **Reporting System** | Report posts, comments, or messages — 5 reports triggers auto-ban |
| 🔐 **Secure Auth** | JWT + HttpOnly cookies with auto-refresh, Google OAuth support |
| 📸 **Image Uploads** | Post images via Cloudinary |
| 🔔 **OTP Reset** | Secure email OTP password recovery |

---

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React 18 + Vite
- 🎨 TailwindCSS + custom CSS design system
- 🔗 React Router v6
- 🔥 Firebase (Google OAuth)
- 📡 Axios with auto-refresh interceptor

**Backend**
- 🟢 Node.js + Express.js
- 📦 MongoDB + Mongoose + `mongoose-aggregate-paginate-v2`
- 🔐 JWT (access + refresh tokens) + HttpOnly cookies
- 🛡️ Google Perspective API (content moderation)
- 🤖 Groq SDK — `llama-3.3-70b-versatile` (chatbot)
- ☁️ Cloudinary (image storage)
- 📧 Nodemailer (OTP emails)
- 🔥 Firebase Admin SDK (token verification)

---

## ⚡ Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB URI (Atlas or local)
- Cloudinary account
- Groq API key → [console.groq.com](https://console.groq.com)
- Google Perspective API key → [perspectiveapi.com](https://perspectiveapi.com)
- Firebase project (for Google login) — optional

---

### 1. Clone the repository

```bash
git clone https://github.com/arhamkac/MissionSakhi.git
cd MissionSakhi
```

---

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
# Server
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/missionsakhi

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (OTP)
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# AI
GROQ_API_KEY=gsk_...
PERSPECTIVE_API_KEY=your_perspective_key

# Firebase Admin (optional — for Google Login)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Start the backend:

```bash
npm run dev
# Runs on http://localhost:8080
```

---

### 3. Frontend setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_API_BASE=http://localhost:8080/api

# Firebase (optional — for Google Login)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Start the frontend:

```bash
npm run dev
# Runs on http://localhost:5173
```

---

### 4. Open the app

Navigate to **http://localhost:5173** in your browser. The backend must be running for all features to work.

---

## 📁 Project Structure

```
MissionSakhi/
├── Backend/
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── middleware/         # Auth, OTP, upload
│   ├── chatbot/            # Groq RAG chatbot
│   │   └── womens_chatbot_dataset.csv
│   └── utils/              # ApiError, ApiResponse, asyncHandler
├── Frontend/
│   ├── src/
│   │   ├── Pages/          # Route-level components
│   │   ├── Components/     # Shared UI components (ReportModal etc.)
│   │   └── apiConfig.js    # Central API URL config
│   └── index.html
├── Images/                 # Screenshots
├── API.md                  # Full API reference
├── CONTRIBUTING.md         # How to contribute
└── README.md
```

---

## 🌐 Deployment

The app is deployed at:
- **Production:** [missionsakhi.onrender.com](https://missionsakhi.onrender.com)

Backend is hosted on [Render](https://render.com). Frontend can be deployed on [Vercel](https://vercel.com).

Make sure all environment variables from the `.env` sections above are configured in your hosting platform.

---

## 📖 API Reference

Full API documentation is available in **[API.md](./API.md)**.

---

## 🤝 Contributing

We welcome contributions! Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** to get started.

---

## 🙏 Acknowledgements

Built with ❤️ to create safer digital spaces for women.

- [Groq](https://groq.com) — ultra-fast LLM inference
- [Google Perspective API](https://perspectiveapi.com) — content moderation
- [Cloudinary](https://cloudinary.com) — image hosting
- [Firebase](https://firebase.google.com) — Google authentication
