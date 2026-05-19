# Hoteru
A modern hotel booking web application built as a personal full-stack project.

## Overview
Hoteru lets users browse hotel rooms, explore room details, book stays, leave reviews, and manage profiles in a polished React UI. The app combines a Vite-powered frontend with an Express backend, Prisma ORM, and PostgreSQL-compatible database support.

## Key Features
- Hotel and room discovery with dynamic filters and search
- Room details page with image previews and amenities
- Booking flow for check-in/check-out and guest selection
- User authentication and profile management
- Review system and rating display
- Responsive design for desktop and mobile

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, DaisyUI
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL-compatible schema via Prisma migrations
- Authentication: Auth0 + JWT support
- Utilities: react-hook-form, React Router, Swiper, bcrypt, cookie-parser, Joi

## Project Structure
- `frontend/` – React app, UI components, routes, and client-side logic
- `backend/` – Express server, Prisma database integration, API routes, and middleware
- `backend/prisma/` – Prisma schema and migration history
- `backend/generated/prisma/` – Prisma client artifacts (generated)

## Setup and Run Locally
1. Install dependencies at the repo root:
   ```bash
   npm install
   ```
2. Start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
3. Open the frontend in your browser at the Vite URL shown in the terminal.

## Backend Notes
- The backend listens on `PORT` or defaults to `8080`
- Uses `@dotenvx/dotenvx/config` to load environment variables
- API routes are registered through `backend/routes/connect_routes.js`
- Prisma provides the database client via `backend/utils/prisma.js`

## Environment Variables
Create a `.env` file for sensitive settings such as:
- `PORT`
- `DATABASE_URL`
- Auth0 credentials and JWT configuration

## Improvements and Future Work
- Add payment integration and booking confirmation emails
- Deploy as a production-ready full-stack application
- Expand room management for hosts and admin features
- Add real-time availability checks and calendar booking UX

## Author
Sandip Das