import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Profile routes
  app.get("/api/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't return password hash
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.patch("/api/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Workout plan routes
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getWorkoutPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });

  app.post("/api/plan/select", async (req, res) => {
    try {
      const { userId, planId } = req.body;
      if (!userId || !planId) {
        return res.status(400).json({ message: "userId and planId are required" });
      }
      const userPlan = await storage.selectUserPlan(userId, planId);
      res.json(userPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to select plan" });
    }
  });

  // Workout routes
  app.get("/api/workout/today/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const activePlan = await storage.getUserActivePlan(userId);
      
      if (!activePlan) {
        return res.status(404).json({ message: "No active plan found" });
      }

      // Get current day of week (0 = Sunday, 1 = Monday, etc.)
      const today = new Date().getDay();
      const dayIndex = today === 0 ? 6 : today - 1; // Convert to Monday = 0 format

      const exercises = await storage.getPlanExercises(activePlan.planId, dayIndex);
      const plan = await storage.getWorkoutPlan(activePlan.planId);
      const playlists = await storage.getMusicPlaylists(plan?.splitType, plan?.goal);

      res.json({
        plan,
        exercises,
        playlists,
        dayIndex,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's workout" });
    }
  });

  app.post("/api/workout/log", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.logProgress(progressData);
      
      // Check for adaptive difficulty adjustment
      const recentProgress = await storage.getUserProgress(progressData.userId, 10);
      const exerciseProgress = recentProgress.filter(p => p.exerciseId === progressData.exerciseId);
      
      if (exerciseProgress.length >= 2) {
        const avgRpe = exerciseProgress.slice(0, 2).reduce((sum, p) => sum + (p.rpe || 5), 0) / 2;
        
        let recommendation = null;
        if (avgRpe <= 7) {
          recommendation = { type: "increase", message: "Consider increasing reps by 10% next session" };
        } else if (avgRpe >= 9) {
          recommendation = { type: "decrease", message: "Consider reducing weight or reps by 10% next session" };
        }
        
        res.json({ progress, recommendation });
      } else {
        res.json({ progress });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to log progress" });
    }
  });

  // Progress routes
  app.get("/api/progress/summary/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      const recentProgress = await storage.getUserProgress(userId, 30);
      
      res.json({
        stats,
        recentProgress,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress summary" });
    }
  });

  // Music routes
  app.get("/api/playlists", async (req, res) => {
    try {
      const { splitType, goal } = req.query;
      const playlists = await storage.getMusicPlaylists(
        splitType as string,
        goal as string
      );
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
