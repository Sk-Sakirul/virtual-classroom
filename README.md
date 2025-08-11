# Virtual Classroom - Modern Learning Platform

## Introduction
A comprehensive virtual classroom application built with React, Redux, and Firebase, featuring video conferencing, interactive whiteboard, real-time chat, and participation tracking.  
The platform enables teachers and students to collaborate in real time, share resources, and track engagement seamlessly. It solves the problem of disconnected online learning experiences by integrating multiple classroom tools into one modern interface.

## Project Type
Frontend | Backend (Firebase Services) | Fullstack

## Deployed App
Frontend: https://your-frontend-url.com  
Backend: https://firebase.google.com  
Database: https://firebase.google.com/products/firestore

## Directory Structure
```
my-app/
├─ backend/ # Firebase backend services & security rules
├─ frontend/ # React application
│ ├─ components/
│ ├─ features/
│ ├─ pages/
│ ├─ services/
│ ├─ store/
│ └─ styles/
```

## Features
- **🎥 Video Conferencing** — Grid layout, mute/unmute, video toggle, screen share, hand raise, participant indicators, session timer.  
- **🎨 Interactive Whiteboard** — Real-time drawing, multiple tools, colors, brush sizes, undo/redo, save state, clear board.  
- **💬 Real-time Chat & File Sharing** — Live messages, typing indicators, file uploads, previews, downloads, filters.  
- **📊 Participation Dashboard (Teacher Only)** — Engagement metrics, leaderboards, charts, exportable reports.  
- **🔐 Authentication & Roles** — Email/password, Google Sign-In, role-based access, protected routes.  
- **📱 Responsive Design** — Mobile friendly, animations, glass morphism, custom scrollbars, toast notifications.

## Design decisions or assumptions
- Firebase was chosen for real-time updates and authentication due to its scalability and ease of integration.  
- Redux Toolkit manages application state to ensure predictable updates and better debugging.  
- Tailwind CSS used for rapid UI development and consistent styling.  
- Participation tracking is designed for teachers only to avoid distraction for students.  

## Installation & Getting started
```bash
# Clone repository
git clone https://github.com/Sk-Sakirul/virtual-classroom.git

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## Example .env
## Example `.env`

```env
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-firebase-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-firebase-app-id"
VITE_FIREBASE_MEASUREMENT_ID="your-firebase-measurement-id"
