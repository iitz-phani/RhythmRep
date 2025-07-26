import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { WorkoutPlayer } from "@/components/workout-player";
import { MusicPlayer } from "@/components/music-player";
import { useAppStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, Heart, Clock, Dumbbell } from "lucide-react";
import { useEffect } from "react";

export default function Workout() {
  const [, setLocation] = useLocation();
  const { workoutState, startWorkout, endWorkout, user } = useAppStore();

  const { data: workoutData, isLoading } = useQuery({
    queryKey: [`/api/workout/today/${user?.id || 1}`],
    enabled: !!user?.id,
  });

  // Auto-redirect to plans if no workout data is available
  useEffect(() => {
    if (!isLoading && !workoutData) {
      setLocation("/plans");
    }
  }, [workoutData, isLoading, setLocation]);

  const handleStartWorkout = () => {
    if (workoutData?.exercises) {
      startWorkout(workoutData.exercises);
    }
  };

  const handleCompleteWorkout = () => {
    endWorkout();
    setLocation("/progress");
  };

  const handleExitWorkout = () => {
    endWorkout();
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <Navigation />
        <div className="max-w-4xl mx-auto p-4 pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading today's workout...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting or loading
  if (isLoading || !workoutData) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <Navigation />
        <div className="max-w-4xl mx-auto p-4 pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading today's workout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workoutState.isWorkoutActive) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 pb-20 md:pb-8">
        <Navigation />
        
        {/* Workout Header */}
        <div className="bg-gray-800 border-b border-gray-600 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="text-gray-400 hover:text-primary"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-xl">{workoutData.plan?.name}</h1>
                <p className="text-gray-400 text-sm">
                  {workoutData.exercises?.length} exercises • Ready to start
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success">
              <Heart className="w-3 h-3 mr-1" />
              Ready
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Today's Workout Preview */}
          <div className="fitness-card">
            <h2 className="text-2xl font-bold mb-6">Today's Workout</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Dumbbell className="text-primary text-xl" />
                </div>
                <div className="text-2xl font-bold">{workoutData.exercises?.length}</div>
                <div className="text-sm text-gray-400">Exercises</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-secondary text-xl" />
                </div>
                <div className="text-2xl font-bold">45-60</div>
                <div className="text-sm text-gray-400">Minutes</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="text-accent text-xl" />
                </div>
                <div className="text-2xl font-bold">Intense</div>
                <div className="text-sm text-gray-400">Difficulty</div>
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-3 mb-8">
              <h3 className="font-semibold text-lg">Exercise List</h3>
              {workoutData.exercises?.map((planExercise: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-mono">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{planExercise.exercise.name}</div>
                      <div className="text-sm text-gray-400">{planExercise.exercise.primaryMuscle}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {planExercise.setsOverride || planExercise.exercise.defaultSets} sets × {planExercise.repsOverride || planExercise.exercise.defaultReps} reps
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleStartWorkout} className="w-full fitness-button text-lg py-6">
              Start Workout
            </Button>
          </div>

          {/* Music Player */}
          <MusicPlayer playlist={workoutData.playlists?.[0]} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-20 md:pb-8">
      <Navigation />
      
      {/* Workout Header */}
      <div className="bg-gray-800 border-b border-gray-600 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExitWorkout}
              className="text-gray-400 hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-xl">{workoutData.plan?.name}</h1>
              <p className="text-gray-400 text-sm">
                Exercise {workoutState.currentExerciseIndex + 1} of {workoutState.exercises.length} • 
                Set {workoutState.currentSet}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-success/10 text-success">
            <Heart className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <WorkoutPlayer exercises={workoutState.exercises} onComplete={handleCompleteWorkout} />
        
        {/* Music Player */}
        <MusicPlayer playlist={workoutData.playlists?.[0]} />
        
        {/* Workout Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="fitness-card text-center p-4">
            <div className="text-2xl font-bold text-primary">
              {workoutState.currentExerciseIndex * 3 + workoutState.currentSet}
            </div>
            <div className="text-sm text-gray-400">Sets Done</div>
          </div>
          <div className="fitness-card text-center p-4">
            <div className="text-2xl font-bold text-secondary">---</div>
            <div className="text-sm text-gray-400">Total lbs</div>
          </div>
          <div className="fitness-card text-center p-4">
            <div className="text-2xl font-bold text-accent">---</div>
            <div className="text-sm text-gray-400">Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
}
