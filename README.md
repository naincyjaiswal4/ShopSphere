# ShopSphere

ShopSphere is a modern full-stack e-commerce platform built with React, Vite, Node.js, and Express.

---

## Project Structure

```text
ShopSphere/
├── client/                 # Frontend (React + Vite)
│   ├── public/             # Static assets
│   ├── src/                # React source files
│   │   ├── assets/         # Images, icons, fonts
│   │   ├── App.css         # Main app styles
│   │   ├── App.jsx         # Root component
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Frontend entry point
│   ├── index.html          # HTML entry
│   ├── package.json        # Client dependencies & scripts
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Configuration files (DB, environment)
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom Express middlewares
│   │   ├── models/         # Database models / schemas
│   │   ├── routes/         # Express API routes
│   │   ├── utils/          # Helper functions and utilities
│   │   ├── app.js          # Express app configuration & middleware
│   │   └── server.js       # Server bootstrap and entry point
│   ├── .env.example        # Environment variable template
│   └── package.json        # Server dependencies & scripts
│
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

---

## Getting Started

### 1. Client Setup (React + Vite)

```bash
cd client
npm install
npm run dev
```

The frontend development server runs on `http://localhost:5173`.

### 2. Server Setup (Node.js + Express)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The backend development server runs on `http://localhost:5000`.

---

## API Endpoints (Base)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
