# 🎙️ VocalLab Assessment

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![JavaScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Nhost](https://img.shields.io/badge/Nhost-Authentication-purple?style=for-the-badge)
![Deepgram](https://img.shields.io/badge/Deepgram-Live%20Speech%20to%20Text-green?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-Fast%20Build-yellow?style=for-the-badge&logo=vite)

### 🚀 Real-Time Speech-to-Text Dashboard with Secure Authentication

Built as part of an SDE Intern Live Coding Assessment.

</div>

---


Live Demo🪧- https://vocallab-assessment.vercel.app/


## 📌 Overview

This project is a full-stack web application that combines:

- 🔐 Secure Authentication using Nhost
- 🎤 Real-time Speech-to-Text Transcription using Deepgram
- 🛡️ Protected Dashboard Routes
- ⚡ Live Transcript Updates
- 💾 Persistent User Sessions

The application allows users to create an account, log in securely, access a protected dashboard, and convert live microphone audio into real-time text.

---

## 🎯 Assessment Requirements

### Authentication Module

- User Signup
- User Login
- Session Persistence
- Protected Dashboard Access
- Nhost Authentication Integration

### Speech-to-Text Dashboard

- Browser Microphone Access
- Live Audio Streaming
- Deepgram WebSocket Integration
- Real-Time Transcript Rendering
- Dashboard-Based User Experience

---

## ✨ Features

### 🔐 Authentication

- Email & Password Signup
- Secure Login
- Session Persistence
- Logout Functionality
- Protected Routes

### 🎤 Live Speech Recognition

- Real-Time Audio Capture
- WebSocket Streaming
- Instant Transcript Updates
- Continuous Speech Processing
- Browser-Based Recording

### 🎨 User Experience

- Clean UI
- Responsive Design
- Fast Navigation
- Real-Time Feedback

---

## 🏗️ Architecture

```text
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Authentication Page │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│       Nhost         │
│   Auth Service      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Protected Dashboard │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Browser Microphone  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Deepgram WebSocket  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Live Transcript UI  │
└─────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React |
| Language | JavaScript |
| Build Tool | Vite |
| Authentication | Nhost |
| Speech Recognition | Deepgram |
| Styling | CSS / Tailwind |
| Deployment | Vercel |

---

## 📂 Project Structure

```bash
src/
│
├── components/
│   ├── Login
│   ├── Signup
│   └── Dashboard
│
├── hooks/
│
├── services/
│   ├── nhost.ts
│   └── deepgram.ts
│
├── routes/
│
├── pages/
│
├── context/
│
├── App.tsx
└── main.tsx
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
VITE_NHOST_SUBDOMAIN=your_subdomain
VITE_NHOST_REGION=your_region

VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/Xatyam07/Vocallab-assessment.git
```

### 2. Navigate to Project

```bash
cd Vocallab-assessment
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env` file and add your Nhost and Deepgram credentials.

### 5. Run Development Server

```bash
npm run dev
```

Application will start on:

```bash
http://localhost:5173
```

---

## 🔑 Nhost Setup

1. Create a free Nhost account.
2. Create a new project.
3. Enable Email Authentication.
4. Copy:
   - Subdomain
   - Region
5. Add them to `.env`.

---

## 🎙️ Deepgram Setup

1. Create a Deepgram account.
2. Generate an API Key.
3. Add the key to `.env`.
4. Start microphone streaming through WebSocket API.

---

## 🧪 Testing Flow

### Authentication

- Create Account
- Login
- Refresh Page
- Verify Session Persistence

### Dashboard

- Access Protected Route
- Start Recording
- Speak into Microphone
- Watch Transcript Update Live

---

## 📈 Evaluation Criteria Addressed

| Criteria | Implementation |
|-----------|--------------|
| Working Product | ✅ Complete End-to-End Flow |
| Speed & Focus | ✅ Core Requirements Delivered |
| Code Sense | ✅ Modular Structure |
| Resourcefulness | ✅ Nhost + Deepgram Integration |
| Creativity | ✅ Modern Dashboard Experience |

---

## 🔒 Security

- API Keys stored in Environment Variables
- Protected Routes
- Authenticated Access Only
- Session-Based Authentication

---

## 🚀 Deployment

Deploy easily using:

- Vercel
- Netlify
- Render

Example:

```bash
npm run build
```

---

## 🔮 Future Improvements

- Export Transcript
- Transcript History
- Multi-Language Recognition
- AI Summary Generation
- Voice Analytics
- User Profile Management

---

## 👨‍💻 Author

### Satyam Mishra

- GitHub: https://github.com/Xatyam07
- Portfolio: https://satyam07portfolio.vercel.app
- LinkedIn: https://www.linkedin.com/in/satyam-mishra-786by4

---

## ⭐ Acknowledgements

- Nhost Authentication
- Deepgram Speech API
- React Ecosystem
- Vite Development Environment

---

## 📄 License

This project was developed for an SDE Intern Live Coding Assessment and is intended for educational and demonstration purposes.

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

</div>