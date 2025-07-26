import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

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

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, passwordHash } = req.body;
      
      if (!email || !passwordHash) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(passwordHash, 10);

      // Create user with minimal data
      const userData = {
        email,
        passwordHash: hashedPassword,
      };

      const user = await storage.createUser(userData);
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Failed to sign in" });
    }
  });

  // Google OAuth route (simplified for demo)
  app.post("/api/auth/google", async (req, res) => {
    try {
      // In a real implementation, you would:
      // 1. Verify the Google ID token
      // 2. Extract user information from the token
      // 3. Create or find the user in your database
      
      // For demo purposes, we'll create a mock user
      const mockGoogleUser = {
        id: Math.floor(Math.random() * 10000) + 1,
        email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: "Google User",
        provider: "google",
        // Add other fields as needed
      };

      // Check if user exists, if not create them
      let user = await storage.getUserByEmail(mockGoogleUser.email);
      if (!user) {
        // Create new user with Google info
        const userData = {
          email: mockGoogleUser.email,
          passwordHash: "google_oauth_user", // Special marker for OAuth users
          // Add other default fields
        };
        user = await storage.createUser(userData);
      }

      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Google OAuth error:", error);
      res.status(500).json({ message: "Failed to authenticate with Google" });
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
      console.log("Plan selection request:", { userId, planId, body: req.body });
      
      if (!userId || !planId) {
        return res.status(400).json({ message: "userId and planId are required" });
      }
      
      // Validate that the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate that the plan exists
      const plan = await storage.getWorkoutPlan(planId);
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      const userPlan = await storage.selectUserPlan(userId, planId);
      console.log("Plan selected successfully:", userPlan);
      res.json(userPlan);
    } catch (error) {
      console.error("Error selecting plan:", error);
      res.status(500).json({ 
        message: "Failed to select plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/plans/custom", async (req, res) => {
    try {
      const { 
        userId, 
        name, 
        splitType, 
        difficulty, 
        goal, 
        equipmentRequired, 
        weeklyFrequency, 
        sessionDuration, 
        specialFocus,
        isCustom = true 
      } = req.body;

      if (!userId || !name || !splitType || !difficulty || !goal || !equipmentRequired) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create a custom schedule based on split type
      let scheduleJson;
      switch (splitType) {
        case "Upper/Lower":
          scheduleJson = JSON.stringify([
            { day: "Monday", type: "Upper", exercises: ["Chest", "Back", "Shoulders", "Arms"] },
            { day: "Tuesday", type: "Lower", exercises: ["Legs", "Glutes"] },
            { day: "Wednesday", type: "Rest" },
            { day: "Thursday", type: "Upper", exercises: ["Chest", "Back", "Shoulders", "Arms"] },
            { day: "Friday", type: "Lower", exercises: ["Legs", "Glutes"] },
            { day: "Saturday", type: "Rest" },
            { day: "Sunday", type: "Rest" },
          ]);
          break;
        case "Push-Pull":
          scheduleJson = JSON.stringify([
            { day: "Monday", type: "Push", exercises: ["Chest", "Shoulders", "Triceps"] },
            { day: "Tuesday", type: "Pull", exercises: ["Back", "Biceps"] },
            { day: "Wednesday", type: "Rest" },
            { day: "Thursday", type: "Push", exercises: ["Chest", "Shoulders", "Triceps"] },
            { day: "Friday", type: "Pull", exercises: ["Back", "Biceps"] },
            { day: "Saturday", type: "Legs", exercises: ["Legs"] },
            { day: "Sunday", type: "Rest" },
          ]);
          break;
        case "Full Body":
          scheduleJson = JSON.stringify([
            { day: "Monday", type: "Full Body", exercises: ["Chest", "Back", "Legs"] },
            { day: "Tuesday", type: "Rest" },
            { day: "Wednesday", type: "Full Body", exercises: ["Shoulders", "Arms", "Core"] },
            { day: "Thursday", type: "Rest" },
            { day: "Friday", type: "Full Body", exercises: ["Chest", "Back", "Legs"] },
            { day: "Saturday", type: "Rest" },
            { day: "Sunday", type: "Rest" },
          ]);
          break;
        case "Cardio":
          scheduleJson = JSON.stringify([
            { day: "Monday", type: "HIIT", exercises: ["Cardio", "Core"] },
            { day: "Tuesday", type: "HIIT", exercises: ["Cardio", "Core"] },
            { day: "Wednesday", type: "Rest" },
            { day: "Thursday", type: "HIIT", exercises: ["Cardio", "Core"] },
            { day: "Friday", type: "HIIT", exercises: ["Cardio", "Core"] },
            { day: "Saturday", type: "Active Recovery", exercises: ["Stretching"] },
            { day: "Sunday", type: "Rest" },
          ]);
          break;
        default:
          scheduleJson = JSON.stringify([
            { day: "Monday", type: "Workout", exercises: ["Full Body"] },
            { day: "Tuesday", type: "Rest" },
            { day: "Wednesday", type: "Workout", exercises: ["Full Body"] },
            { day: "Thursday", type: "Rest" },
            { day: "Friday", type: "Workout", exercises: ["Full Body"] },
            { day: "Saturday", type: "Rest" },
            { day: "Sunday", type: "Rest" },
          ]);
      }

      const customPlan = {
        name,
        splitType,
        difficulty,
        goal,
        equipmentRequired,
        scheduleJson,
        isCustom: true,
        userId: userId,
        description: specialFocus || `Custom ${splitType} plan for ${goal}`,
        weeklyFrequency,
        sessionDuration
      };

      const newPlan = await storage.createCustomPlan(customPlan);
      res.json(newPlan);
    } catch (error) {
      console.error("Custom plan creation error:", error);
      res.status(500).json({ message: "Failed to create custom plan" });
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
