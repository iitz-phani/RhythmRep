# Workout-Plus-Music Training Web App

## Overview

This is a full-stack fitness web application that combines workout planning with music streaming. Users can select workout plans, follow guided exercise sessions, and listen to matching music playlists during their training. The app includes user onboarding, progress tracking, and adaptive difficulty adjustment based on user feedback.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Tailwind CSS** for styling with custom fitness-themed design system
- **shadcn/ui** component library for consistent UI components
- **Zustand** for client-side state management
- **TanStack Query** for server state management and API calls
- **Wouter** for lightweight client-side routing

### Backend Architecture
- **Express.js** with TypeScript for the REST API server
- **Better-SQLite3** for database operations (with Drizzle ORM ready for PostgreSQL migration)
- **Drizzle ORM** for type-safe database queries and schema management
- Modular storage layer with interface-based design for easy database switching

### Build and Development Setup
- **ESBuild** for production server bundling
- **Vite** handles frontend hot-reloading and development
- **TypeScript** configuration supports both client and server code
- **PostCSS** with Tailwind for CSS processing

## Key Components

### User Management
- Complete onboarding flow with 7-step wizard
- User profile management with fitness metrics (BMI, calories)
- Preference storage for equipment, music, and fitness goals

### Workout System
- Pre-defined workout plans (Cardio, Push-Pull, Isolated, Combination splits)
- Exercise library with animated GIFs and muscle group targeting
- Real-time workout player with set/rep tracking
- Rest timer with browser notifications and sound alerts
- Adaptive difficulty based on RPE (Rate of Perceived Exertion) feedback

### Music Integration
- Music playlist management integrated with workout types
- Embedded music player component (prepared for YouTube/Spotify integration)
- Genre-based playlist recommendations based on workout intensity

### Progress Tracking
- Comprehensive progress dashboard with charts
- Volume tracking and body weight trends
- Workout streak monitoring
- RPE-based difficulty adjustment system

## Data Flow

1. **User Onboarding**: Collects user metrics → calculates BMI/calories → stores preferences
2. **Plan Selection**: User chooses workout plan → system creates user-plan relationship
3. **Workout Execution**: Loads daily exercises → tracks sets/reps/RPE → adjusts future difficulty
4. **Progress Analysis**: Aggregates workout data → generates charts and statistics

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React-DOM, React Query)
- Express.js server framework
- Drizzle ORM with Better-SQLite3 driver
- Tailwind CSS and PostCSS

### UI and UX Libraries
- Radix UI primitives for accessible components
- Lucide React for icons
- Recharts for progress visualization
- Class Variance Authority for component styling

### Development Tools
- Vite with React plugin
- TypeScript compiler
- ESBuild for production bundling
- Replit-specific development plugins

## Deployment Strategy

### Development Environment
- Runs entirely within Replit's environment
- Hot-reloading for both client and server code
- SQLite database for zero-configuration development

### Production Considerations
- **Database**: Currently uses SQLite, configured for easy PostgreSQL migration via Drizzle
- **Build Process**: Vite builds client-side assets, ESBuild bundles server
- **Environment Variables**: Database URL and API keys via `.env`
- **Static Assets**: Vite handles asset optimization and bundling

### Performance Optimizations
- Lazy loading for UI components
- Query caching with TanStack Query
- Optimized bundle splitting
- Lightweight routing with Wouter

## Changelog
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.