# RhythmRep - Workout + Music Training Web App

A full-stack fitness web application that combines workout planning with music streaming. Users can select workout plans, follow guided exercise sessions, and listen to matching music playlists during their training.

## 🚀 Features

- **Complete User Onboarding**: 7-step wizard for fitness goals and preferences
- **Workout Plans**: Cardio, Push-Pull, Isolated, and Combination splits
- **Real-time Workout Player**: Set/rep tracking with rest timers
- **Music Integration**: Playlist management with workout type matching
- **Progress Tracking**: Comprehensive dashboard with charts and statistics
- **Adaptive Difficulty**: RPE-based difficulty adjustment system

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Zustand** for client-side state management
- **TanStack Query** for server state management
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript
- **SQLite** with Drizzle ORM
- **Better-SQLite3** for database operations
- **Passport.js** for authentication

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RhythmRep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

This will start both the client (Vite dev server) and server (Express API) concurrently.

## 🎯 Development Commands

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the Vite dev server (port 5173)
- `npm run dev:server` - Start only the Express server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Sync database schema changes

## 📁 Project Structure

```
RhythmRep/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
│   └── index.html
├── server/                # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── database.ts        # Database configuration
│   └── storage.ts         # Data access layer
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema
├── attached_assets/       # Static assets and images
└── fitness.db            # SQLite database file
```

## 🎨 UI Components

The app uses a comprehensive set of UI components built with shadcn/ui and Radix UI:

- **Navigation**: Responsive navigation with mobile support
- **Workout Player**: Real-time exercise tracking with animations
- **Music Player**: Embedded music streaming component
- **Progress Charts**: Data visualization with Recharts
- **Forms**: Complete onboarding and settings forms

## 🗄️ Database Schema

The application uses Drizzle ORM with SQLite, featuring:

- **Users**: Profile information and preferences
- **Workout Plans**: Pre-defined exercise routines
- **Exercises**: Exercise library with metadata
- **Workout Sessions**: User workout history and progress
- **Music Playlists**: Genre-based music recommendations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Create a `.env` file for production:
```env
NODE_ENV=production
DATABASE_URL=your_database_url
```

## 🤝 Contributing

1. Follow the existing code patterns and TypeScript conventions
2. Use Tailwind CSS for styling
3. Implement proper error handling and loading states
4. Test your changes thoroughly

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions, please check the project documentation or create an issue in the repository.