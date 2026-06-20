<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&height=300&color=0:4F46E5,25:6366F1,50:7C3AED,75:8B5CF6,100:A855F7&text=VocalLab%20Assessment&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Real-Time%20Speech-to-Text%20Dashboard%20with%20Secure%20Authentication&descAlignY=58"/>
</p>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=24&duration=3000&pause=1000&color=8B5CF6&center=true&vCenter=true&width=900&lines=Secure+Auth+with+Nhost;Live+Microphone+Speech+Capture;Real-Time+Deepgram+Transcription;Protected+Dashboard+Routes;Built+for+an+SDE+Intern+Assessment"/>

</div>

<div align="center">

![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Nhost](https://img.shields.io/badge/Nhost-Authentication-1EE6C2?style=for-the-badge)
![Deepgram](https://img.shields.io/badge/Deepgram-Live%20Speech--to--Text-13EF93?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/Xatyam07/Vocallab-assessment?style=for-the-badge&color=7C3AED)
![GitHub last commit](https://img.shields.io/github/last-commit/Xatyam07/Vocallab-assessment?style=for-the-badge&color=6366F1)
![GitHub stars](https://img.shields.io/github/stars/Xatyam07/Vocallab-assessment?style=for-the-badge&color=A855F7)
![License](https://img.shields.io/badge/License-Educational%2FDemo-4F46E5?style=for-the-badge)

</div>

<div align="center">

<a href="https://vocallab-assessment.vercel.app/">
<img src="https://img.shields.io/badge/🪧_Live_Demo-Visit_App-7C3AED?style=for-the-badge"/>
</a>
<a href="https://github.com/Xatyam07/Vocallab-assessment">
<img src="https://img.shields.io/badge/📦_Repository-GitHub-4F46E5?style=for-the-badge&logo=github&logoColor=white"/>
</a>

</div>

<br>

> VocalLab Assessment is a full-stack web application built for an SDE Intern Live Coding Assessment, combining secure Nhost authentication with real-time speech-to-text transcription powered by Deepgram. Users sign up, log in, land on a protected dashboard, and convert live microphone audio into text in real time.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Assessment Requirements](#-assessment-requirements)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [Nhost Setup](#-nhost-setup)
- [Deepgram Setup](#️-deepgram-setup)
- [Testing Flow](#-testing-flow)
- [Evaluation Criteria Addressed](#-evaluation-criteria-addressed)
- [Security](#-security)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [Acknowledgements](#-acknowledgements)
- [License](#-license)

---

## 📌 Overview

This project combines:

- 🔐 Secure Authentication using Nhost
- 🎤 Real-time Speech-to-Text Transcription using Deepgram
- 🛡️ Protected Dashboard Routes
- ⚡ Live Transcript Updates
- 💾 Persistent User Sessions

---

## 🎯 Assessment Requirements

<table>
<tr>
<td width="50%">

**Authentication Module**
- User Signup
- User Login
- Session Persistence
- Protected Dashboard Access
- Nhost Authentication Integration

</td>
<td width="50%">

**Speech-to-Text Dashboard**
- Browser Microphone Access
- Live Audio Streaming
- Deepgram WebSocket Integration
- Real-Time Transcript Rendering
- Dashboard-Based User Experience

</td>
</tr>
</table>

---

## ✨ Features

<table>
<tr>
<td width="33%">

**🔐 Authentication**
- Email and Password Signup
- Secure Login
- Session Persistence
- Logout Functionality
- Protected Routes

</td>
<td width="33%">

**🎤 Live Speech Recognition**
- Real-Time Audio Capture
- WebSocket Streaming
- Instant Transcript Updates
- Continuous Speech Processing
- Browser-Based Recording

</td>
<td width="33%">

**🎨 User Experience**
- Clean UI
- Responsive Design
- Fast Navigation
- Real-Time Feedback

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A[User] --> B[Authentication Page]
    B --> C[Nhost Auth Service]
    C --> D[Protected Dashboard]
    D --> E[Browser Microphone]
    E --> F[Deepgram WebSocket]
    F --> G[Live Transcript UI]
```

---

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,javascript,vite,tailwind"/>

</div>

| Category | Technology |
|-----------|------------|
| Frontend | React 19 |
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

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Xatyam07/Vocallab-assessment.git
cd Vocallab-assessment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file (see [Environment Variables](#️-environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

App runs at:

```bash
http://localhost:5173
```

---

## ⚙️ Environment Variables

**`.env`**

```env
VITE_NHOST_SUBDOMAIN=your_subdomain
VITE_NHOST_REGION=your_region

VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
```

---

## 🔑 Nhost Setup

1. Create a free Nhost account
2. Create a new project
3. Enable Email Authentication
4. Copy your **Subdomain** and **Region**
5. Add them to `.env`

---

## 🎙️ Deepgram Setup

1. Create a Deepgram account
2. Generate an API Key
3. Add the key to `.env`
4. Start microphone streaming through the WebSocket API

---

## 🧪 Testing Flow

<table>
<tr>
<td width="50%">

**Authentication**
- Create Account
- Login
- Refresh Page
- Verify Session Persistence

</td>
<td width="50%">

**Dashboard**
- Access Protected Route
- Start Recording
- Speak into Microphone
- Watch Transcript Update Live

</td>
</tr>
</table>

---

## 📈 Evaluation Criteria Addressed

| Criteria | Implementation |
|-----------|--------------|
| Working Product | ✅ Complete End-to-End Flow |
| Speed and Focus | ✅ Core Requirements Delivered |
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

<div align="center">

<img src="https://skillicons.dev/icons?i=vercel,netlify"/>

</div>

```bash
npm run build
```

Deploy the `dist/` output to Vercel, Netlify, or Render.

---

## 🔮 Roadmap

- [ ] Export Transcript
- [ ] Transcript History
- [ ] Multi-Language Recognition
- [ ] AI Summary Generation
- [ ] Voice Analytics
- [ ] User Profile Management

---

## 👨‍💻 Author

<div align="center">

### Satyam Mishra

<a href="https://github.com/Xatyam07">
<img src="https://img.shields.io/badge/GitHub-Follow-4F46E5?style=for-the-badge&logo=github&logoColor=white"/>
</a>
<a href="https://satyam07portfolio.vercel.app">
<img src="https://img.shields.io/badge/Portfolio-Visit-7C3AED?style=for-the-badge&logo=vercel&logoColor=white"/>
</a>
<a href="https://www.linkedin.com/in/satyam-mishra-786by4">
<img src="https://img.shields.io/badge/LinkedIn-Connect-6366F1?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>

</div>

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

⭐ If you found this project interesting, consider giving it a star!

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:A855F7,50:7C3AED,100:4F46E5&section=footer"/>

</div>
