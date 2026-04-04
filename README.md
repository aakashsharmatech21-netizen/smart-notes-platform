# 📚 Smart Notes Platform

A full-stack MERN notes marketplace where students can **buy and sell study PDFs** — with AI-generated summaries, secure authentication, and cloud storage.

> Built for Hackwarts Hackathon | Theme: Smart Education

**Live Demo:** https://smart-notes-platform.vercel.app

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, protected routes
- 📤 **Seller Upload** — Upload study PDFs → stored on Cloudinary → AI summary generated instantly
- 🤖 **AI-Powered Summaries** — OpenRouter API (LLaMA model) generates a concise, student-friendly summary for every note
- 🛒 **Buyer Flow** — Browse notes, view AI summary before buying, mock payment, download PDF
- 🔄 **Role Switching** — Switch between Buyer and Seller mode after login
- 🔍 **Search & Filter** — Search by keyword, filter by subject and price
- 📊 **Dashboard** — Sellers see their uploads + buyer count; Buyers see purchased notes
- 💳 **Mock Payment** — Razorpay-ready (KYC pending for live payments)

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite, Tailwind CSS v3, React Router DOM |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer + Cloudinary (PDF only) |
| AI Summaries | OpenRouter API (meta-llama/llama-3.2-3b-instruct) |
| Payment | Mock (Razorpay-ready) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Folder Structure

```
smart-notes-platform/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── notesController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── notesRoutes.js
│   │   └── paymentRoutes.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── assets/
        │   └── hero.png
        ├── components/
        │   └── Footer.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── NoteDetail.jsx
        │   ├── Register.jsx
        │   └── UploadNote.jsx
        └── utils/
            └── api.js
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| PATCH | /api/auth/change-role | Switch buyer/seller role |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes/ | Get all notes (with search & filter) |
| GET | /api/notes/:id | Get single note |
| POST | /api/notes/upload | Upload note (seller only) |
| GET | /api/notes/my/notes | Get seller's own notes |
| DELETE | /api/notes/:id | Delete note (seller only) |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payment/create-order | Create mock payment order |
| POST | /api/payment/verify | Verify payment |
| GET | /api/payment/purchased | Get purchased notes |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account
- OpenRouter API key

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://your_direct_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENROUTER_API_KEY=your_openrouter_key
```

> ⚠️ Use `mongodb://` direct connection string, not `mongodb+srv://`

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> Change `baseURL` in `frontend/src/utils/api.js` to `http://localhost:5000/api` for local dev.

---

## 👥 Team

| Name | Branch | Role |
|------|--------|------|
| Aakash Sharma | main | Backend + Deployment + Merge |
| Riya Bhardwaj | feature-my-work | Frontend |

---

## 📌 Known Issues

- Razorpay live payments pending bank KYC (mock payment works)
- Notes uploaded before PDF fix may have broken download URLs
- Render free tier sleeps after 15 min inactivity
