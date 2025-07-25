import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  heightCm?: number;
  weightKg?: number;
  age?: number;
  sex?: string;
  fitnessLevel?: string;
  goal?: string;
  equipment?: string;
  musicPrefJson?: string;
  wearableProvider?: string;
  bmi?: number;
  suggestedCalories?: number;
}

interface WorkoutState {
  currentExerciseIndex: number;
  currentSet: number;
  exercises: any[];
  isWorkoutActive: boolean;
  restTimeRemaining: number;
  isRestTimerActive: boolean;
}

interface AppState {
  user: User | null;
  currentPlan: any | null;
  workoutState: WorkoutState;
  setUser: (user: User | null) => void;
  setCurrentPlan: (plan: any) => void;
  updateWorkoutState: (updates: Partial<WorkoutState>) => void;
  startWorkout: (exercises: any[]) => void;
  completeSet: () => void;
  nextExercise: () => void;
  endWorkout: () => void;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  decrementRestTimer: () => void;
}

const initialWorkoutState: WorkoutState = {
  currentExerciseIndex: 0,
  currentSet: 1,
  exercises: [],
  isWorkoutActive: false,
  restTimeRemaining: 0,
  isRestTimerActive: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      currentPlan: null,
      workoutState: initialWorkoutState,

      setUser: (user) => set({ user }),
      
      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      
      updateWorkoutState: (updates) =>
        set((state) => ({
          workoutState: { ...state.workoutState, ...updates },
        })),

      startWorkout: (exercises) =>
        set({
          workoutState: {
            ...initialWorkoutState,
            exercises,
            isWorkoutActive: true,
          },
        }),

      completeSet: () => {
        const { workoutState } = get();
        const currentExercise = workoutState.exercises[workoutState.currentExerciseIndex];
        const totalSets = currentExercise?.setsOverride || currentExercise?.exercise?.defaultSets || 3;
        
        if (workoutState.currentSet < totalSets) {
          set((state) => ({
            workoutState: {
              ...state.workoutState,
              currentSet: state.workoutState.currentSet + 1,
            },
          }));
        }
      },

      nextExercise: () => {
        const { workoutState } = get();
        if (workoutState.currentExerciseIndex < workoutState.exercises.length - 1) {
          set((state) => ({
            workoutState: {
              ...state.workoutState,
              currentExerciseIndex: state.workoutState.currentExerciseIndex + 1,
              currentSet: 1,
            },
          }));
        } else {
          get().endWorkout();
        }
      },

      endWorkout: () =>
        set({
          workoutState: initialWorkoutState,
        }),

      startRestTimer: (seconds) =>
        set((state) => ({
          workoutState: {
            ...state.workoutState,
            restTimeRemaining: seconds,
            isRestTimerActive: true,
          },
        })),

      stopRestTimer: () =>
        set((state) => ({
          workoutState: {
            ...state.workoutState,
            restTimeRemaining: 0,
            isRestTimerActive: false,
          },
        })),

      decrementRestTimer: () => {
        const { workoutState } = get();
        if (workoutState.restTimeRemaining > 0) {
          set((state) => ({
            workoutState: {
              ...state.workoutState,
              restTimeRemaining: state.workoutState.restTimeRemaining - 1,
            },
          }));
        } else {
          get().stopRestTimer();
        }
      },
    }),
    {
      name: "fitflow-storage",
      partialize: (state) => ({ user: state.user, currentPlan: state.currentPlan }),
    }
  )
);
