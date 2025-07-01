import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

const sqlite = new Database("fitness.db");
export const db = drizzle(sqlite, { schema });

// Initialize tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    height_cm INTEGER,
    weight_kg REAL,
    age INTEGER,
    sex TEXT,
    fitness_level TEXT,
    goal TEXT,
    equipment TEXT,
    music_pref_json TEXT,
    wearable_provider TEXT,
    wearable_token TEXT,
    bmi REAL,
    suggested_calories INTEGER
  );

  CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    split_type TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    goal TEXT NOT NULL,
    equipment_required TEXT NOT NULL,
    schedule_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    primary_muscle TEXT NOT NULL,
    gif_url TEXT NOT NULL,
    default_sets INTEGER NOT NULL,
    default_reps INTEGER NOT NULL,
    base_difficulty INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plan_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    day_index INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets_override INTEGER,
    reps_override INTEGER,
    rest_seconds INTEGER NOT NULL DEFAULT 90,
    order_in_day INTEGER NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES workout_plans (id),
    FOREIGN KEY (exercise_id) REFERENCES exercises (id)
  );

  CREATE TABLE IF NOT EXISTS music_playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    genre TEXT NOT NULL,
    bpm_range TEXT NOT NULL,
    url TEXT NOT NULL,
    split_type TEXT,
    goal TEXT
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER,
    date TEXT NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets_done INTEGER NOT NULL,
    reps_done INTEGER NOT NULL,
    weight_used REAL,
    rpe INTEGER,
    hr_avg INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (plan_id) REFERENCES workout_plans (id),
    FOREIGN KEY (exercise_id) REFERENCES exercises (id)
  );

  CREATE TABLE IF NOT EXISTS user_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    selected_at TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (plan_id) REFERENCES workout_plans (id)
  );
`);
