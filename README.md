# 💬 Realtime Chat App

This is a group project for Hacktiv8.

---

# 🚀 Live Deployment

Frontend (Vercel):
https://boringchat.vercel.app

Backend (Railway):
https://chat-server-production-ae46.up.railway.app

---

# ✨ Features

- 🔥 Realtime messaging (Socket.IO)
- 🤖 AI integration via Gemini (@BotAI mention)
- 🖼 Image upload support
- 🕒 Timestamp with hover full date

---

# 🛠 Tech Stack

## Frontend
- React (Vite)
- TailwindCSS
- Socket.IO Client
- Axios

## Backend
- Node.js
- Express
- Socket.IO
- Gemini API
- Multer (File Upload)
- Uploadcare (Image Hosting)

---

# 📘 API Documentation

## Base URL

Production:
```
https://chat-server-production-ae46.up.railway.app
```

---

# 1️⃣ Upload Image

### Endpoint
```
POST /upload
```

### Description
Upload image before sending it to chat.

### Request
Content-Type: `multipart/form-data`

Form Data:
```
file: <image file>
```

### Success Response (200)
```json
{
  "imageUrl": "https://res.cloudinary.com/.../image.jpg"
}
```

### Error Response (400)
```json
{
  "message": "File is required"
}
```

---

# 🔌 WebSocket Events

Connection via Socket.IO to:

```
BASE_URL
```

---

## 🔹 Event: `chat history`

### Description
Automatically sent by server when client connects.  
Contains full chat history.

### Example Response
```json
[
  {
    "id": 1,
    "content": "Hello world",
    "imageUrl": null,
    "createdAt": "2026-02-25T10:00:00.000Z",
    "User": {
      "username": "Vincent"
    }
  }
]
```

---

## 🔹 Event: `chat message`

### Emit (Client → Server)
```json
{
  "text": "Hello",
  "imageUrl": ""
}
```

### Broadcast (Server → All Clients)
```json
{
  "id": 2,
  "content": "Hello",
  "imageUrl": null,
  "createdAt": "2026-02-25T10:05:00.000Z",
  "User": {
    "username": "Vincent"
  }
}
```

---

## 🔹 Event: `typing`

### Emit (Client → Server)
```json
"Vincent"
```

### Broadcast (Server → Other Clients)
```json
"Vincent"
```

Used to display typing indicator.

---

# 🤖 AI Integration

When user sends a message containing:

```
@BotAI
```

Server will:
1. Save user message
2. Generate AI response using Gemini API
3. Broadcast AI response as bot user

AI response format is identical to normal chat message object.

---

# 📦 Local Development Setup

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```
PORT=3000
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run server:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

---

# 🚀 Deployment Guide

## Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable:

```
VITE_API_URL=https://your-backend-url
```

4. Deploy

---

## Backend (Railway)

1. Push backend to GitHub
2. Deploy via Railway
3. Configure environment variables:
   - GEMINI_API_KEY
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
4. Deploy

---

# 📜 License

MIT License

---

# 👨‍💻 Author

Built as a full-stack realtime portfolio project demonstrating:

- WebSocket architecture
- Real-time state synchronization
- AI integration in production environment
- Clean UI/UX micro-interactions
- Full deployment pipeline (Vercel + Railway)
