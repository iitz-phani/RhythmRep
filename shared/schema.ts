import { integer, text, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  heightCm: integer("height_cm"),
  weightKg: real("weight_kg"),
  age: integer("age"),
  sex: text("sex"),
  fitnessLevel: text("fitness_level"), // Beginner, Intermediate, Advanced
  goal: text("goal"), // Lose, Build, Maintain
  equipment: text("equipment"), // Home, Dumbbells, Full Gym
  musicPrefJson: text("music_pref_json"), // JSON string of preferences
  wearableProvider: text("wearable_provider"),
  wearableToken: text("wearable_token"),
  bmi: real("bmi"),
  suggestedCalories: integer("suggested_calories"),
});

export const workoutPlans = sqliteTable("workout_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  splitType: text("split_type").notNull(), // Cardio, Push-Pull, Isolated, Combination
  difficulty: text("difficulty").notNull(),
  goal: text("goal").notNull(),
  equipmentRequired: text("equipment_required").notNull(),
  scheduleJson: text("schedule_json").notNull(), // JSON array of day objects
});

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  primaryMuscle: text("primary_muscle").notNull(),
  gifUrl: text("gif_url").notNull(),
  defaultSets: integer("default_sets").notNull(),
  defaultReps: integer("default_reps").notNull(),
  baseDifficulty: integer("base_difficulty").notNull(),
});

export const planExercises = sqliteTable("plan_exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  planId: integer("plan_id").notNull().references(() => workoutPlans.id),
  dayIndex: integer("day_index").notNull(),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  setsOverride: integer("sets_override"),
  repsOverride: integer("reps_override"),
  restSeconds: integer("rest_seconds").notNull().default(90),
  orderInDay: integer("order_in_day").notNull(),
});

export const musicPlaylists = sqliteTable("music_playlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  genre: text("genre").notNull(),
  bpmRange: text("bpm_range").notNull(),
  url: text("url").notNull(),
  splitType: text("split_type"),
  goal: text("goal"),
});

export const userProgress = sqliteTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").references(() => workoutPlans.id),
  date: text("date").notNull(),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  setsDone: integer("sets_done").notNull(),
  repsDone: integer("reps_done").notNull(),
  weightUsed: real("weight_used"),
  rpe: integer("rpe"), // Rate of Perceived Exertion 1-10
  hrAvg: integer("hr_avg"), // Average heart rate
});

export const userPlans = sqliteTable("user_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").notNull().references(() => workoutPlans.id),
  selectedAt: text("selected_at").notNull(),
  isActive: integer("is_active").notNull().default(1),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  bmi: true,
  suggestedCalories: true,
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertUserPlanSchema = createInsertSchema(userPlans).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserPlan = typeof userPlans.$inferSelect;
export type PlanExercise = typeof planExercises.$inferSelect;
export type MusicPlaylist = typeof musicPlaylists.$inferSelect;
