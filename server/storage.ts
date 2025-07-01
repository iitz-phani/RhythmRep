import { eq, desc, and } from "drizzle-orm";
import { db } from "./database";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  WorkoutPlan,
  Exercise,
  UserProgress,
  InsertUserProgress,
  UserPlan,
  PlanExercise,
  MusicPlaylist,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Workout plan methods
  getWorkoutPlans(): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  selectUserPlan(userId: number, planId: number): Promise<UserPlan>;
  getUserActivePlan(userId: number): Promise<UserPlan | undefined>;

  // Exercise methods
  getExercise(id: number): Promise<Exercise | undefined>;
  getPlanExercises(planId: number, dayIndex?: number): Promise<(PlanExercise & { exercise: Exercise })[]>;

  // Progress methods
  logProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProgress(userId: number, limit?: number): Promise<UserProgress[]>;
  getUserStats(userId: number): Promise<any>;

  // Music methods
  getMusicPlaylists(splitType?: string, goal?: string): Promise<MusicPlaylist[]>;
}

export class SqliteStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    // Calculate BMI and suggested calories
    let bmi, suggestedCalories;
    if (user.heightCm && user.weightKg) {
      bmi = user.weightKg / Math.pow(user.heightCm / 100, 2);
      // Basic calorie calculation (Harris-Benedict equation)
      const bmr = user.sex === "male" 
        ? 88.362 + (13.397 * user.weightKg) + (4.799 * user.heightCm) - (5.677 * (user.age || 25))
        : 447.593 + (9.247 * user.weightKg) + (3.098 * user.heightCm) - (4.330 * (user.age || 25));
      
      const activityMultiplier = user.fitnessLevel === "Advanced" ? 1.725 : 
                                user.fitnessLevel === "Intermediate" ? 1.55 : 1.375;
      suggestedCalories = Math.round(bmr * activityMultiplier);
    }

    const result = await db.insert(schema.users).values({
      ...user,
      bmi,
      suggestedCalories,
    }).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  }

  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    return await db.select().from(schema.workoutPlans);
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    const result = await db.select().from(schema.workoutPlans).where(eq(schema.workoutPlans.id, id));
    return result[0];
  }

  async selectUserPlan(userId: number, planId: number): Promise<UserPlan> {
    // Deactivate current plan
    await db.update(schema.userPlans)
      .set({ isActive: 0 })
      .where(eq(schema.userPlans.userId, userId));

    // Insert new active plan
    const result = await db.insert(schema.userPlans).values({
      userId,
      planId,
      selectedAt: new Date().toISOString(),
      isActive: 1,
    }).returning();
    return result[0];
  }

  async getUserActivePlan(userId: number): Promise<UserPlan | undefined> {
    const result = await db.select().from(schema.userPlans)
      .where(and(eq(schema.userPlans.userId, userId), eq(schema.userPlans.isActive, 1)));
    return result[0];
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    const result = await db.select().from(schema.exercises).where(eq(schema.exercises.id, id));
    return result[0];
  }

  async getPlanExercises(planId: number, dayIndex?: number): Promise<(PlanExercise & { exercise: Exercise })[]> {
    let whereCondition;
    if (dayIndex !== undefined) {
      whereCondition = and(eq(schema.planExercises.planId, planId), eq(schema.planExercises.dayIndex, dayIndex));
    } else {
      whereCondition = eq(schema.planExercises.planId, planId);
    }

    const planExercises = await db.select()
      .from(schema.planExercises)
      .where(whereCondition)
      .orderBy(schema.planExercises.orderInDay);

    const results = [];
    for (const planExercise of planExercises) {
      const exercise = await this.getExercise(planExercise.exerciseId);
      if (exercise) {
        results.push({
          ...planExercise,
          exercise
        });
      }
    }

    return results as (PlanExercise & { exercise: Exercise })[];
  }

  async logProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const result = await db.insert(schema.userProgress).values(progress).returning();
    return result[0];
  }

  async getUserProgress(userId: number, limit = 50): Promise<UserProgress[]> {
    return await db.select().from(schema.userProgress)
      .where(eq(schema.userProgress.userId, userId))
      .orderBy(desc(schema.userProgress.date))
      .limit(limit);
  }

  async getUserStats(userId: number): Promise<any> {
    const progress = await this.getUserProgress(userId);
    
    // Calculate stats
    const totalWorkouts = new Set(progress.map(p => p.date)).size;
    const totalVolume = progress.reduce((sum, p) => sum + (p.weightUsed || 0) * p.repsDone, 0);
    const currentStreak = this.calculateStreak(progress);
    
    return {
      totalWorkouts,
      totalVolume,
      currentStreak,
      totalSets: progress.length,
    };
  }

  private calculateStreak(progress: UserProgress[]): number {
    const uniqueDates = Array.from(new Set(progress.map(p => p.date))).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (date === expectedDateStr || (i === 0 && date === today)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  async getMusicPlaylists(splitType?: string, goal?: string): Promise<MusicPlaylist[]> {
    if (splitType || goal) {
      const conditions = [];
      if (splitType) conditions.push(eq(schema.musicPlaylists.splitType, splitType));
      if (goal) conditions.push(eq(schema.musicPlaylists.goal, goal));
      return await db.select().from(schema.musicPlaylists).where(and(...conditions));
    }
    
    return await db.select().from(schema.musicPlaylists);
  }
}

export const storage = new SqliteStorage();
