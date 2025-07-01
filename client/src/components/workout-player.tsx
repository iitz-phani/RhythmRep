import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ExerciseDemo } from "./exercise-demo";
import { useRestTimer } from "@/hooks/use-rest-timer";
import { useAppStore } from "@/lib/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, Forward, Pause } from "lucide-react";

interface WorkoutPlayerProps {
  exercises: any[];
  onComplete: () => void;
}

export function WorkoutPlayer({ exercises, onComplete }: WorkoutPlayerProps) {
  const { workoutState, completeSet, nextExercise, startRestTimer, stopRestTimer } = useAppStore();
  const { timeRemaining, isActive: isRestActive, formattedTime } = useRestTimer();
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [selectedRpe, setSelectedRpe] = useState(7);
  const queryClient = useQueryClient();

  const currentExercise = exercises[workoutState.currentExerciseIndex];
  const currentExerciseData = currentExercise?.exercise;
  const totalSets = currentExercise?.setsOverride || currentExerciseData?.defaultSets || 3;
  const targetReps = currentExercise?.repsOverride || currentExerciseData?.defaultReps || 10;
  const restSeconds = currentExercise?.restSeconds || 90;

  const logProgressMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/workout/log", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress/summary"] });
    },
  });

  const handleCompleteSet = async () => {
    if (!weight || !reps) return;

    const progressData = {
      userId: 1, // TODO: Get from auth context
      planId: null, // TODO: Get from current plan
      date: new Date().toISOString().split('T')[0],
      exerciseId: currentExerciseData.id,
      setsDone: workoutState.currentSet,
      repsDone: parseInt(reps),
      weightUsed: parseFloat(weight),
      rpe: selectedRpe,
    };

    await logProgressMutation.mutateAsync(progressData);

    if (workoutState.currentSet < totalSets) {
      completeSet();
      startRestTimer(restSeconds);
    } else {
      // Move to next exercise
      if (workoutState.currentExerciseIndex < exercises.length - 1) {
        nextExercise();
        setWeight("");
        setReps("");
        setSelectedRpe(7);
      } else {
        onComplete();
      }
    }
  };

  const skipRest = () => {
    stopRestTimer();
  };

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">No exercises available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exercise Progress */}
      <div className="fitness-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Exercise {workoutState.currentExerciseIndex + 1} of {exercises.length}
          </h3>
          <div className="text-sm text-gray-400">
            Set {workoutState.currentSet} of {totalSets}
          </div>
        </div>
        <Progress 
          value={((workoutState.currentExerciseIndex * totalSets + workoutState.currentSet) / (exercises.length * totalSets)) * 100} 
          className="h-2"
        />
      </div>

      {/* Current Exercise */}
      <div className="fitness-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exercise Demo */}
          <ExerciseDemo exercise={currentExerciseData} />

          {/* Exercise Details & Logging */}
          <div className="space-y-6">
            {/* Set Progress */}
            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Current Set</h3>
                <span className="text-2xl font-mono font-bold text-primary">
                  {workoutState.currentSet}
                </span>
                <span className="text-gray-400"> / {totalSets}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold text-secondary">{targetReps}</div>
                  <div className="text-sm text-gray-400">Target Reps</div>
                </div>
                <div className="text-center">  
                  <div className="text-2xl font-mono font-bold text-accent">
                    {weight || "---"}
                  </div>
                  <div className="text-sm text-gray-400">lbs</div>
                </div>
              </div>

              {/* Weight & Reps Input */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <Label className="text-xs text-gray-400">Weight (lbs)</Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white font-mono"
                    placeholder="185"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400">Reps Done</Label>
                  <Input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white font-mono"
                    placeholder={targetReps.toString()}
                  />
                </div>
              </div>

              {/* RPE Scale */}
              <div className="mb-4">
                <Label className="text-sm text-gray-400 block mb-2">
                  Rate of Perceived Exertion (RPE)
                </Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpe) => (
                    <Button
                      key={rpe}
                      variant={selectedRpe === rpe ? "default" : "outline"}
                      size="sm"
                      className={`w-8 h-8 p-0 text-sm ${
                        selectedRpe === rpe
                          ? "bg-primary text-white"
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-primary hover:text-white"
                      }`}
                      onClick={() => setSelectedRpe(rpe)}
                    >
                      {rpe}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Selected: {selectedRpe} ({selectedRpe <= 3 ? "Easy" : selectedRpe <= 6 ? "Moderate" : selectedRpe <= 8 ? "Hard" : "Very Hard"})
                </div>
              </div>

              <Button
                className="w-full fitness-button"
                onClick={handleCompleteSet}
                disabled={!weight || !reps || logProgressMutation.isPending}
              >
                <Check className="w-4 h-4 mr-2" />
                Complete Set
              </Button>
            </div>

            {/* Rest Timer */}
            {isRestActive && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 text-center">
                <div className="text-4xl font-mono font-bold text-primary mb-2">
                  {formattedTime}
                </div>
                <div className="text-sm text-gray-400 mb-3">Rest Time Remaining</div>
                <div className="flex justify-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={skipRest}
                    className="border-primary/20 text-primary hover:bg-primary hover:text-white"
                  >
                    <Forward className="w-4 h-4 mr-1" />
                    Skip
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
