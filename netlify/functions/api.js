const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Initialize Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://rhythmrep.netlify.app', 'https://rhythmrep.netlify.app']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Neon Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Database helper functions
const db = {
  async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  },

  async getUser(id) {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async getUserByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async createUser(userData) {
    const { email, passwordHash, name, age, sex, heightCm, weightKg, fitnessLevel } = userData;
    
    let bmi, suggestedCalories;
    if (heightCm && weightKg) {
      bmi = weightKg / Math.pow(heightCm / 100, 2);
      const bmr = sex === "male" 
        ? 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * (age || 25))
        : 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * (age || 25));
      
      const activityMultiplier = fitnessLevel === "Advanced" ? 1.725 : 
                                fitnessLevel === "Intermediate" ? 1.55 : 1.375;
      suggestedCalories = Math.round(bmr * activityMultiplier);
    }

    const result = await this.query(
      'INSERT INTO users (email, password_hash, name, age, sex, height_cm, weight_kg, fitness_level, bmi, suggested_calories) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [email, passwordHash, name, age, sex, heightCm, weightKg, fitnessLevel, bmi, suggestedCalories]
    );
    return result.rows[0];
  },

  async getWorkoutPlans() {
    const result = await this.query('SELECT * FROM workout_plans ORDER BY id');
    return result.rows;
  },

  async getWorkoutPlan(id) {
    const result = await this.query('SELECT * FROM workout_plans WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createCustomPlan(planData) {
    const result = await this.query(
      'INSERT INTO workout_plans (name, split_type, difficulty, goal, equipment_required, schedule_json, is_custom, user_id, description, weekly_frequency, session_duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [planData.name, planData.splitType, planData.difficulty, planData.goal, planData.equipmentRequired, planData.scheduleJson, planData.isCustom, planData.userId, planData.description, planData.weeklyFrequency, planData.sessionDuration]
    );
    return result.rows[0];
  },

  async selectUserPlan(userId, planId) {
    // Deactivate current plan
    await this.query('UPDATE user_plans SET is_active = false WHERE user_id = $1', [userId]);
    
    // Insert new active plan
    const result = await this.query(
      'INSERT INTO user_plans (user_id, plan_id, selected_at, is_active) VALUES ($1, $2, NOW(), true) RETURNING *',
      [userId, planId]
    );
    return result.rows[0];
  },

  async getUserActivePlan(userId) {
    const result = await this.query(
      'SELECT * FROM user_plans WHERE user_id = $1 AND is_active = true',
      [userId]
    );
    return result.rows[0];
  },

  async getPlanExercises(planId, dayIndex) {
    const result = await this.query(
      `SELECT pe.*, e.* FROM plan_exercises pe 
       JOIN exercises e ON pe.exercise_id = e.id 
       WHERE pe.plan_id = $1 AND pe.day_index = $2 
       ORDER BY pe.order_in_day`,
      [planId, dayIndex]
    );
    return result.rows.map(row => ({
      ...row,
      exercise: {
        id: row.id,
        name: row.name,
        primaryMuscle: row.primary_muscle,
        gifUrl: row.gif_url,
        defaultSets: row.default_sets,
        defaultReps: row.default_reps,
        baseDifficulty: row.base_difficulty
      }
    }));
  },

  async getMusicPlaylists(splitType, goal) {
    let query = 'SELECT * FROM music_playlists';
    let params = [];
    
    if (splitType && goal) {
      query += ' WHERE split_type = $1 AND goal = $2';
      params = [splitType, goal];
    } else if (splitType) {
      query += ' WHERE split_type = $1';
      params = [splitType];
    } else if (goal) {
      query += ' WHERE goal = $1';
      params = [goal];
    }
    
    const result = await this.query(query, params);
    return result.rows;
  },

  async logProgress(progressData) {
    const result = await this.query(
      'INSERT INTO user_progress (user_id, plan_id, date, exercise_id, sets_done, reps_done, weight_used, rpe, hr_avg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [progressData.userId, progressData.planId, progressData.date, progressData.exerciseId, progressData.setsDone, progressData.repsDone, progressData.weightUsed, progressData.rpe, progressData.hrAvg]
    );
    return result.rows[0];
  },

  async getUserProgress(userId, limit = 50) {
    const result = await this.query(
      'SELECT * FROM user_progress WHERE user_id = $1 ORDER BY date DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  }
};

// API Routes
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await db.getWorkoutPlans();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Failed to fetch workout plans' });
  }
});

app.post('/api/plans/custom', async (req, res) => {
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
      return res.status(400).json({ message: 'Missing required fields' });
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

    const newPlan = await db.createCustomPlan(customPlan);
    res.json(newPlan);
  } catch (error) {
    console.error('Custom plan creation error:', error);
    res.status(500).json({ message: 'Failed to create custom plan' });
  }
});

app.post('/api/plan/select', async (req, res) => {
  try {
    const { userId, planId } = req.body;
    console.log('Plan selection request:', { userId, planId, body: req.body });
    
    if (!userId || !planId) {
      return res.status(400).json({ message: 'userId and planId are required' });
    }
    
    const user = await db.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const plan = await db.getWorkoutPlan(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }
    
    const userPlan = await db.selectUserPlan(userId, planId);
    console.log('Plan selected successfully:', userPlan);
    res.json(userPlan);
  } catch (error) {
    console.error('Error selecting plan:', error);
    res.status(500).json({ 
      message: 'Failed to select plan',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/workout/today/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const activePlan = await db.getUserActivePlan(userId);
    
    if (!activePlan) {
      return res.status(404).json({ message: 'No active plan found' });
    }

    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1; // Convert to Monday = 0 format

    const exercises = await db.getPlanExercises(activePlan.plan_id, dayIndex);
    const plan = await db.getWorkoutPlan(activePlan.plan_id);
    const playlists = await db.getMusicPlaylists(plan?.split_type, plan?.goal);

    res.json({
      plan,
      exercises,
      playlists,
      dayIndex,
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ message: 'Failed to fetch today\'s workout' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const userData = {
      email,
      passwordHash: hashedPassword,
    };

    const user = await db.createUser(userData);
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Failed to create account' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(passwordHash, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Failed to sign in' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    // In a real implementation, you would:
    // 1. Verify the Google ID token
    // 2. Extract user information from the token
    // 3. Create or find the user in your database
    
    // For demo purposes, we'll create a mock user
    const mockGoogleUser = {
      id: Math.floor(Math.random() * 10000) + 1,
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
      name: 'Google User',
      provider: 'google',
    };

    // Check if user exists, if not create them
    let user = await db.getUserByEmail(mockGoogleUser.email);
    if (!user) {
      const userData = {
        email: mockGoogleUser.email,
        passwordHash: 'google_oauth_user', // Special marker for OAuth users
      };
      user = await db.createUser(userData);
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Failed to authenticate with Google' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export the serverless function
module.exports.handler = serverless(app); 