# AI Customer Support Agent

A chat app where users can sign up, log in, and talk to an AI assistant

Built as a full-stack project using React, Node.js, MongoDB, and OpenRouter for the AI.

---

## What it does

- Sign up and log in with JWT auth
- Start a conversation with an AI assistant
- full history is saved
- Each user only sees their own chats
- Runs locally or in Docker

---

## Stack

**Frontend** — React + Vite, React Router, Axios, Tailwind + shadcn/ui

**Backend** — Node.js, Express, Mongoose

**Database** — MongoDB Atlas

**AI** — OpenRouter (free models — falls back automatically if one is rate limited)

**Auth** — JWT + bcrypt

**DevOps** — Docker + Docker Compose with live reload in dev

---

## Running locally (without Docker)

You need Node 18+, and a MongoDB Atlas account.

**1. Clone and install**

```bash
git clone https://github.com/your-username/ai-customer-support.git
cd ai-customer-support
```

```bash
cd server && npm install
cd ../client && npm install
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
MONGO_URL=           your MongoDB Atlas connection string
JWT_SECRET=          any random string, keep it secret
OPENROUTER_API_KEY=  get a free key at openrouter.ai/keys
```

**3. Start the backend**

```bash
cd server
npm run dev
# running on http://localhost:3000
```

**4. Start the frontend**

```bash
cd client
npm run dev
# running on http://localhost:5173
```

---

## Running with Docker

Make sure Docker is installed, then:

```bash
cp .env.example .env
# fill in .env with your keys

docker compose up --build
```

Open http://localhost:5173

Both the frontend and backend have live reload — edit any file and it updates instantly without rebuilding.

To stop:

```bash
docker compose down
```

---

## API routes

All `/chat` routes require an `Authorization: Bearer <token>` header.

```
POST   /auth/signup                  create account
POST   /auth/login                   returns JWT token

POST   /chat/startconversation       start a new chat, returns chatId
POST   /chat/sendmessage             send a message to an existing chat
GET    /chat/conversations           get all conversations for this user
```

---

## Getting your keys

**MongoDB Atlas**

1. Go to https://cloud.mongodb.com and create a free cluster
2. Click Connect → Drivers → copy the connection string
3. Replace `<password>` with your actual password

**OpenRouter**

1. Go to https://openrouter.ai/keys
2. Create a free account and generate a key
3. The app uses `mistralai/mistral-7b-instruct:free` by default and falls back to other free models if that one is rate limited

---

## Notes

- Free tier on Render spins down after 15 mins of inactivity — the first request after that will be slow (~30s)
- OpenRouter free models get rate limited occasionally.
- Passwords are hashed with bcrypt, tokens expire after 7 days
