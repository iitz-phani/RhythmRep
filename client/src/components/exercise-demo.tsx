import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseDemoProps {
  exercise: {
    name: string;
    gifUrl: string;
    primaryMuscle: string;
  };
}

export function ExerciseDemo({ exercise }: ExerciseDemoProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={exercise.gifUrl}
          alt={`${exercise.name} demonstration`}
          className="w-full h-64 object-cover rounded-xl bg-gray-700"
          style={{ objectFit: "contain" }}
        />
        <div className="absolute top-4 left-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          {isPlaying ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          <span>Demo</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 bg-gray-900/80 hover:bg-gray-900/90"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
      <div className="text-center">
        <h2 className="font-bold text-2xl mb-2">{exercise.name}</h2>
        <p className="text-gray-400">Primary: {exercise.primaryMuscle}</p>
      </div>
    </div>
  );
}
