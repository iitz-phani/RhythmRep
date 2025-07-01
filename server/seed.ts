import { db } from "./database";
import * as schema from "@shared/schema";

export async function seedData() {
  // Clear existing data
  await db.delete(schema.planExercises);
  await db.delete(schema.exercises);
  await db.delete(schema.workoutPlans);
  await db.delete(schema.musicPlaylists);

  // Seed exercises
  const exercises = [
    {
      name: "Barbell Bench Press",
      primaryMuscle: "Chest",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 4,
      defaultReps: 8,
      baseDifficulty: 7,
    },
    {
      name: "Incline Dumbbell Press",
      primaryMuscle: "Chest",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 3,
      defaultReps: 10,
      baseDifficulty: 6,
    },
    {
      name: "Tricep Dips",
      primaryMuscle: "Triceps",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 3,
      defaultReps: 12,
      baseDifficulty: 5,
    },
    {
      name: "Overhead Press",
      primaryMuscle: "Shoulders",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 4,
      defaultReps: 8,
      baseDifficulty: 7,
    },
    {
      name: "Pull-ups",
      primaryMuscle: "Back",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 3,
      defaultReps: 8,
      baseDifficulty: 8,
    },
    {
      name: "Barbell Rows",
      primaryMuscle: "Back",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 4,
      defaultReps: 10,
      baseDifficulty: 6,
    },
    {
      name: "Bicep Curls",
      primaryMuscle: "Biceps",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 3,
      defaultReps: 12,
      baseDifficulty: 4,
    },
    {
      name: "Squats",
      primaryMuscle: "Legs",
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
      defaultSets: 4,
      defaultReps: 12,
      baseDifficulty: 6,
    },
  ];

  const insertedExercises = await db.insert(schema.exercises).values(exercises).returning();

  // Seed workout plans
  const pushPullPlan = await db.insert(schema.workoutPlans).values({
    name: "Push-Pull Split",
    splitType: "Push-Pull",
    difficulty: "Intermediate",
    goal: "Build",
    equipmentRequired: "Full Gym",
    scheduleJson: JSON.stringify([
      { day: "Monday", type: "Push", exercises: ["Chest", "Shoulders", "Triceps"] },
      { day: "Tuesday", type: "Pull", exercises: ["Back", "Biceps"] },
      { day: "Wednesday", type: "Rest" },
      { day: "Thursday", type: "Push", exercises: ["Chest", "Shoulders", "Triceps"] },
      { day: "Friday", type: "Pull", exercises: ["Back", "Biceps"] },
      { day: "Saturday", type: "Legs", exercises: ["Legs"] },
      { day: "Sunday", type: "Rest" },
    ]),
  }).returning();

  // Seed plan exercises for Push-Pull plan
  const planExercises = [
    // Day 0 (Monday) - Push
    { planId: pushPullPlan[0].id, dayIndex: 0, exerciseId: insertedExercises[0].id, orderInDay: 1, restSeconds: 120 }, // Bench Press
    { planId: pushPullPlan[0].id, dayIndex: 0, exerciseId: insertedExercises[1].id, orderInDay: 2, restSeconds: 90 }, // Incline Press
    { planId: pushPullPlan[0].id, dayIndex: 0, exerciseId: insertedExercises[3].id, orderInDay: 3, restSeconds: 90 }, // Overhead Press
    { planId: pushPullPlan[0].id, dayIndex: 0, exerciseId: insertedExercises[2].id, orderInDay: 4, restSeconds: 60 }, // Tricep Dips
    
    // Day 1 (Tuesday) - Pull
    { planId: pushPullPlan[0].id, dayIndex: 1, exerciseId: insertedExercises[4].id, orderInDay: 1, restSeconds: 120 }, // Pull-ups
    { planId: pushPullPlan[0].id, dayIndex: 1, exerciseId: insertedExercises[5].id, orderInDay: 2, restSeconds: 90 }, // Barbell Rows
    { planId: pushPullPlan[0].id, dayIndex: 1, exerciseId: insertedExercises[6].id, orderInDay: 3, restSeconds: 60 }, // Bicep Curls
    
    // Day 3 (Thursday) - Push (repeat)
    { planId: pushPullPlan[0].id, dayIndex: 3, exerciseId: insertedExercises[0].id, orderInDay: 1, restSeconds: 120 },
    { planId: pushPullPlan[0].id, dayIndex: 3, exerciseId: insertedExercises[1].id, orderInDay: 2, restSeconds: 90 },
    { planId: pushPullPlan[0].id, dayIndex: 3, exerciseId: insertedExercises[3].id, orderInDay: 3, restSeconds: 90 },
    { planId: pushPullPlan[0].id, dayIndex: 3, exerciseId: insertedExercises[2].id, orderInDay: 4, restSeconds: 60 },
    
    // Day 4 (Friday) - Pull (repeat)
    { planId: pushPullPlan[0].id, dayIndex: 4, exerciseId: insertedExercises[4].id, orderInDay: 1, restSeconds: 120 },
    { planId: pushPullPlan[0].id, dayIndex: 4, exerciseId: insertedExercises[5].id, orderInDay: 2, restSeconds: 90 },
    { planId: pushPullPlan[0].id, dayIndex: 4, exerciseId: insertedExercises[6].id, orderInDay: 3, restSeconds: 60 },
    
    // Day 5 (Saturday) - Legs
    { planId: pushPullPlan[0].id, dayIndex: 5, exerciseId: insertedExercises[7].id, orderInDay: 1, restSeconds: 120 }, // Squats
  ];

  await db.insert(schema.planExercises).values(planExercises);

  // Seed music playlists
  const musicPlaylists = [
    {
      name: "HIIT Pump",
      genre: "Electronic",
      bpmRange: "170-190",
      url: "https://www.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI",
      splitType: "Cardio",
      goal: "Lose",
    },
    {
      name: "Strength Builder",
      genre: "Hip Hop",
      bpmRange: "120-140",
      url: "https://www.youtube.com/playlist?list=PLFgquLnL59akA2PflFpeQG9L01VFg90wS",
      splitType: "Push-Pull",
      goal: "Build",
    },
    {
      name: "Cardio Chill",
      genre: "Pop",
      bpmRange: "100-120",
      url: "https://www.youtube.com/playlist?list=PLFgquLnL59alqNjuVQbUoGRAFmB9BkCPJ",
      splitType: "Cardio",
      goal: "Maintain",
    },
  ];

  await db.insert(schema.musicPlaylists).values(musicPlaylists);

  console.log("Database seeded successfully!");
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData().catch(console.error);
}
