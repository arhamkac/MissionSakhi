# 🌸 Contributing to Mission Sakhi

Hey! Welcome — we're really glad you're here.

Mission Sakhi is built by students. Whether you've been coding for 3 months or 3 years, there's a place for you here. **You don't need to know the backend at all to contribute** — there's tons of frontend and design work available.

---

## What can I work on?

### Great for beginners

- Fix a typo or improve wording somewhere in the UI
- Make a button, card, or page look better
- Improve the app on mobile screens
- Add a loading state or better error message
- Improve the chatbot's suggested prompts (just edit an array in the file)
- Add more forum categories (same — just an array)
- Add Q&A rows to the chatbot's knowledge CSV file
- Fix or improve any part of the README or docs

### If you know a bit more React

- Add pagination to forum posts
- Add search to community rooms
- Improve the post detail page (`/post/:id`)

### Advanced

- Upgrade chat to real-time with WebSockets
- Add dark mode
- Write tests

---

## Setting up locally

### What you need first

- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recommended)

---

### Step 1 — Fork and clone

Click **Fork** on the [GitHub repo](https://github.com/arhamkac/MissionSakhi) to get your own copy. Then clone it:

```bash
git clone https://github.com/<your-username>/MissionSakhi.git
cd MissionSakhi
```

---

### Step 2 — Frontend only (easiest)

If you want to work only on the UI, you don't need to set up MongoDB or any API keys. Just point the frontend at the live backend:

```bash
cd Frontend
npm install
```

Create a file called `.env` inside `Frontend/` with:

```env
VITE_API_BASE=https://missionsakhi.onrender.com/api
```

Start it:
```bash
npm run dev
```

Open `http://localhost:5173`. That's it — start coding! ✅

---

### Step 3 — Full setup (Frontend + Backend)

Only needed if you want to change backend code.

```bash
cd Backend
npm install
```

Create `.env` inside `Backend/`:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=any_long_random_string
REFRESH_TOKEN_SECRET=another_long_random_string
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value
GROQ_API_KEY=your_key
PERSPECTIVE_API_KEY=your_key
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

> Where to get these:
> - **MONGODB_URI** → [MongoDB Atlas](https://mongodb.com/atlas) (free) → create cluster → click Connect
> - **ACCESS_TOKEN_SECRET** → just type any long random string
> - **CLOUDINARY_*** → [cloudinary.com](https://cloudinary.com) (free) → Dashboard
> - **GROQ_API_KEY** → [console.groq.com](https://console.groq.com) (free)
> - **PERSPECTIVE_API_KEY** → [perspectiveapi.com](https://perspectiveapi.com) (can skip this for most work)

```bash
npm run dev   # Backend starts on http://localhost:8080
```

Then update your Frontend `.env` to use local:
```env
VITE_API_BASE=http://localhost:8080/api
```

---

## Making a change and submitting a PR

### 1. Create a branch

Never edit `main` directly. Make a branch:

```bash
git checkout -b your-branch-name
```

Name it something like `fix-button-style` or `add-forum-category`.

---

### 2. Make your changes

Edit files in VS Code. Frontend code is in `Frontend/src/Pages/` and `Frontend/src/Components/`.

---

### 3. Save and commit

```bash
git add .
git commit -m "describe what you changed in one line"
```

---

### 4. Push to your fork

```bash
git push origin your-branch-name
```

---

### 5. Open a Pull Request on GitHub

1. Go to **your fork** on GitHub (e.g. `github.com/<your-username>/MissionSakhi`)
2. You'll see a banner that says **"Compare & pull request"** — click it
3. Fill in the title (what did you change?) and description (why? any screenshots?)
4. Click **"Create pull request"**

That's it — the maintainer will review, leave comments if needed, and merge it when ready. 🌸

---

## A few things to keep in mind

- Don't commit your `.env` file (it's already in `.gitignore`)
- Don't paste API keys directly in code
- Use `API_BASE` from `apiConfig.js` for all API URLs — never hardcode `localhost:8080`
- Remove any `console.log()` before your final commit

---

## Need help?

Open an [issue](https://github.com/arhamkac/MissionSakhi/issues) or a [discussion](https://github.com/arhamkac/MissionSakhi/discussions) — describe what you're trying to do and what's going wrong. We're happy to help you get your first PR merged. 🌸
