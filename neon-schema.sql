-- Neon Database Schema for RhythmRep
-- This file contains the PostgreSQL schema for the fitness application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    age INTEGER,
    sex VARCHAR(10),
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    fitness_level VARCHAR(20),
    bmi DECIMAL(4,2),
    suggested_calories INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout plans table
CREATE TABLE IF NOT EXISTS workout_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    split_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    goal VARCHAR(20) NOT NULL,
    equipment_required VARCHAR(50) NOT NULL,
    schedule_json TEXT NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id),
    description TEXT,
    weekly_frequency VARCHAR(50),
    session_duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    primary_muscle VARCHAR(50) NOT NULL,
    gif_url TEXT NOT NULL,
    default_sets INTEGER NOT NULL,
    default_reps INTEGER NOT NULL,
    base_difficulty INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plan exercises table (junction table)
CREATE TABLE IF NOT EXISTS plan_exercises (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES workout_plans(id) ON DELETE CASCADE,
    day_index INTEGER NOT NULL,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    sets_override INTEGER,
    reps_override INTEGER,
    rest_seconds INTEGER NOT NULL DEFAULT 90,
    order_in_day INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User plans table (user's selected plans)
CREATE TABLE IF NOT EXISTS user_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES workout_plans(id) ON DELETE CASCADE,
    selected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES workout_plans(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    sets_done INTEGER NOT NULL,
    reps_done INTEGER NOT NULL,
    weight_used DECIMAL(6,2),
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    hr_avg INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Music playlists table
CREATE TABLE IF NOT EXISTS music_playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    bpm_range VARCHAR(20) NOT NULL,
    url TEXT NOT NULL,
    split_type VARCHAR(50),
    goal VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plan_exercises_plan_id ON plan_exercises(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_exercises_day_index ON plan_exercises(day_index);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_active ON user_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date);
CREATE INDEX IF NOT EXISTS idx_music_playlists_split_goal ON music_playlists(split_type, goal);

-- Insert sample data
INSERT INTO exercises (name, primary_muscle, gif_url, default_sets, default_reps, base_difficulty) VALUES
('Barbell Bench Press', 'Chest', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 4, 8, 7),
('Incline Dumbbell Press', 'Chest', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 3, 10, 6),
('Tricep Dips', 'Triceps', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 3, 12, 5),
('Overhead Press', 'Shoulders', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 4, 8, 7),
('Pull-ups', 'Back', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 3, 8, 8),
('Barbell Rows', 'Back', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 4, 10, 6),
('Bicep Curls', 'Biceps', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 3, 12, 4),
('Squats', 'Legs', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format', 4, 12, 6)
ON CONFLICT DO NOTHING;

-- Insert sample workout plans
INSERT INTO workout_plans (name, split_type, difficulty, goal, equipment_required, schedule_json) VALUES
('Push-Pull Split', 'Push-Pull', 'Intermediate', 'Build', 'Full Gym', '[
  {"day": "Monday", "type": "Push", "exercises": ["Chest", "Shoulders", "Triceps"]},
  {"day": "Tuesday", "type": "Pull", "exercises": ["Back", "Biceps"]},
  {"day": "Wednesday", "type": "Rest"},
  {"day": "Thursday", "type": "Push", "exercises": ["Chest", "Shoulders", "Triceps"]},
  {"day": "Friday", "type": "Pull", "exercises": ["Back", "Biceps"]},
  {"day": "Saturday", "type": "Legs", "exercises": ["Legs"]},
  {"day": "Sunday", "type": "Rest"}
]'),
('Full Body Beginner', 'Full Body', 'Beginner', 'Build', 'Minimal', '[
  {"day": "Monday", "type": "Full Body", "exercises": ["Chest", "Back", "Legs"]},
  {"day": "Tuesday", "type": "Rest"},
  {"day": "Wednesday", "type": "Full Body", "exercises": ["Shoulders", "Arms", "Core"]},
  {"day": "Thursday", "type": "Rest"},
  {"day": "Friday", "type": "Full Body", "exercises": ["Chest", "Back", "Legs"]},
  {"day": "Saturday", "type": "Rest"},
  {"day": "Sunday", "type": "Rest"}
]'),
('HIIT Cardio Blast', 'Cardio', 'Advanced', 'Cut', 'Minimal', '[
  {"day": "Monday", "type": "HIIT", "exercises": ["Cardio", "Core"]},
  {"day": "Tuesday", "type": "HIIT", "exercises": ["Cardio", "Core"]},
  {"day": "Wednesday", "type": "Rest"},
  {"day": "Thursday", "type": "HIIT", "exercises": ["Cardio", "Core"]},
  {"day": "Friday", "type": "HIIT", "exercises": ["Cardio", "Core"]},
  {"day": "Saturday", "type": "Active Recovery", "exercises": ["Stretching"]},
  {"day": "Sunday", "type": "Rest"}
]'),
('Upper/Lower Split', 'Upper/Lower', 'Intermediate', 'Build', 'Full Gym', '[
  {"day": "Monday", "type": "Upper", "exercises": ["Chest", "Back", "Shoulders", "Arms"]},
  {"day": "Tuesday", "type": "Lower", "exercises": ["Legs", "Glutes"]},
  {"day": "Wednesday", "type": "Rest"},
  {"day": "Thursday", "type": "Upper", "exercises": ["Chest", "Back", "Shoulders", "Arms"]},
  {"day": "Friday", "type": "Lower", "exercises": ["Legs", "Glutes"]},
  {"day": "Saturday", "type": "Rest"},
  {"day": "Sunday", "type": "Rest"}
]')
ON CONFLICT DO NOTHING;

-- Insert sample music playlists
INSERT INTO music_playlists (name, genre, bpm_range, url, split_type, goal) VALUES
('HIIT Pump', 'Electronic', '170-190', 'https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI', 'Cardio', 'Lose'),
('Strength Builder', 'Hip Hop', '120-140', 'https://www.youtube.com/playlist?list=PLFgquLnL59akA2PflFpeQG9L01VFg90wS', 'Push-Pull', 'Build'),
('Cardio Chill', 'Pop', '100-120', 'https://www.youtube.com/playlist?list=PLFgquLnL59alqNjuVQbUoGRAFmB9BkCPJ', 'Cardio', 'Maintain')
ON CONFLICT DO NOTHING;

-- Insert sample plan exercises for Push-Pull plan
INSERT INTO plan_exercises (plan_id, day_index, exercise_id, order_in_day, rest_seconds) 
SELECT 
    wp.id as plan_id,
    pe.day_index,
    pe.exercise_id,
    pe.order_in_day,
    pe.rest_seconds
FROM (
    VALUES 
        (0, 1, 1, 120), -- Day 0, Bench Press
        (0, 2, 2, 90),  -- Day 0, Incline Press
        (0, 4, 4, 90),  -- Day 0, Overhead Press
        (0, 3, 3, 60),  -- Day 0, Tricep Dips
        (1, 5, 1, 120), -- Day 1, Pull-ups
        (1, 6, 2, 90),  -- Day 1, Barbell Rows
        (1, 7, 3, 60),  -- Day 1, Bicep Curls
        (3, 1, 1, 120), -- Day 3, Bench Press
        (3, 2, 2, 90),  -- Day 3, Incline Press
        (3, 4, 4, 90),  -- Day 3, Overhead Press
        (3, 3, 3, 60),  -- Day 3, Tricep Dips
        (4, 5, 1, 120), -- Day 4, Pull-ups
        (4, 6, 2, 90),  -- Day 4, Barbell Rows
        (4, 7, 3, 60),  -- Day 4, Bicep Curls
        (5, 8, 1, 120)  -- Day 5, Squats
) AS pe(day_index, exercise_id, order_in_day, rest_seconds)
CROSS JOIN (SELECT id FROM workout_plans WHERE name = 'Push-Pull Split' LIMIT 1) wp
ON CONFLICT DO NOTHING; 