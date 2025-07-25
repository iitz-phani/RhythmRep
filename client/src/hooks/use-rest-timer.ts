import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

export function useRestTimer() {
  const { workoutState, decrementRestTimer, stopRestTimer } = useAppStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (workoutState.isRestTimerActive && workoutState.restTimeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        decrementRestTimer();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      
      // Timer finished - play sound and show notification
      if (workoutState.restTimeRemaining === 0 && workoutState.isRestTimerActive) {
        playTimerSound();
        showNotification();
        stopRestTimer();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [workoutState.isRestTimerActive, workoutState.restTimeRemaining, decrementRestTimer, stopRestTimer]);

  const playTimerSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        // Use a simple beep sound URL or data URI
        audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBj2a2u7MeyolIHfH8N2QQAoUXrTp66hVFApGn+Dyg=";
      }
      audioRef.current.play().catch(() => {
        // Ignore audio play errors (e.g., user hasn't interacted with page)
      });
    } catch (error) {
      console.warn("Could not play timer sound:", error);
    }
  };

  const showNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Rest Time Complete!", {
        body: "Ready for your next set?",
        icon: "/favicon.ico",
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Rest Time Complete!", {
            body: "Ready for your next set?",
            icon: "/favicon.ico",
          });
        }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeRemaining: workoutState.restTimeRemaining,
    isActive: workoutState.isRestTimerActive,
    formattedTime: formatTime(workoutState.restTimeRemaining),
  };
}
