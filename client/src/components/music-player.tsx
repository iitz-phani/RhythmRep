import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  playlist?: {
    name: string;
    url: string;
    genre: string;
  };
}

export function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(154); // 2:34
  const [duration] = useState(252); // 4:12
  const [volume, setVolume] = useState([75]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / duration) * 100;

  if (!playlist) {
    return (
      <div className="fitness-card text-center text-gray-400">
        <p>No playlist selected</p>
      </div>
    );
  }

  return (
    <div className="fitness-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Volume2 className="text-white h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">{playlist.name}</div>
            <div className="text-sm text-gray-400">{playlist.genre}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-primary hover:bg-primary/80 text-white"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <SkipForward className="h-4 w-4" />
          </Button>
          <div className="text-sm text-gray-400 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-3">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>
    </div>
  );
}
