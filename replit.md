# STEM Project Generator

## Overview
A React + Vite frontend application for generating STEM project ideas for Atal Tinkering Labs. The app helps students and educators create comprehensive electronics, robotics, IoT, automation, and sensor projects with detailed component lists, skills required, and step-by-step instructions.

## Project Architecture

### Frontend (React + Vite + TypeScript)
- **Location**: `frontend/`
- **Port**: 5000 (development)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context (Auth, Preferences, Animation, Performance)
- **Routing**: React Router v6
- **API Integration**: Can connect to external backend or uses mock data fallback

### Backend (Python FastAPI) - Optional
- **Location**: `backend/`
- **Framework**: FastAPI with uvicorn
- **Database**: Supabase (optional, gracefully degrades)
- **Features**: Project generation API, status checks, project saving

## Key Files
- `frontend/vite.config.ts` - Vite configuration (port 5000, allowedHosts: true)
- `frontend/src/App.tsx` - Main React application with routing
- `frontend/src/services/apiService.ts` - API service with fallback to mock data
- `frontend/src/lib/supabase.ts` - Supabase client with mock fallback
- `backend/server.py` - FastAPI backend server

## Development
- Frontend runs on port 5000 with Vite dev server
- Backend API defaults to external Render deployment
- Frontend works standalone with mock data if backend unavailable

## Environment Variables (Optional)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_BASE_URL` - Backend API URL (defaults to Render deployment)

## Deployment
- Static deployment using Vite build output
- Build command: `npm run build --prefix frontend`
- Public directory: `frontend/dist`
