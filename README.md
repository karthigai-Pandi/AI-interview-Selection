# AI Interview Selection

A professional AI-powered recruitment platform built with the MERN stack, Tailwind CSS, Framer Motion, Socket.IO, and OpenAI integration.

## Features

- Modern SaaS UI with glassmorphism, animated dashboards, and responsive layouts
- Candidate and HR/Admin dashboards with analytics, filters, and real-time notifications
- JWT authentication, role-based access, Google OAuth-ready structure, and secure middleware
- AI-powered mock interviews, resume analysis, candidate ranking, and speech-to-text workflows
- Video interview platform scaffolding with WebRTC and coding assessment architecture
- Production-ready backend structure with MVC, validation, and API routing

## Folder Structure

- `client/`: React + Vite frontend
- `server/`: Express API server with MongoDB models and middleware

## Getting Started

1. Install dependencies for the workspace:

   ```bash
   npm install
   ```

2. Copy environment files:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Run the monorepo in development mode:

   ```bash
   npm run dev
   ```

4. Open the app:

   - Frontend: http://localhost:4173
   - Backend: http://localhost:5000/api

## Deployment

- Frontend deployable to Vercel via `client/`
- Backend deployable to Render or Heroku via `server/`

## Notes

This platform is designed as a startup-grade MVP with enterprise-ready structure, reusable UI components, scalable API routes, and modular AI services.
