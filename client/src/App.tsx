import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Onboarding from "@/pages/onboarding";
import Plans from "@/pages/plans";
import Workout from "@/pages/workout";
import Progress from "@/pages/progress";
import Settings from "@/pages/settings";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-20 md:pb-8">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 pt-8">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl mb-4">Welcome to FitFlow</h1>
          <p className="text-gray-400 text-lg">Your fitness journey starts here</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="fitness-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🏃</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">Start Workout</h3>
            <p className="text-gray-400 mb-4">Begin your training session</p>
            <a href="/workout" className="fitness-button inline-block">
              Start Now
            </a>
          </div>
          
          <div className="fitness-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">View Progress</h3>
            <p className="text-gray-400 mb-4">Track your achievements</p>
            <a href="/progress" className="fitness-button inline-block">
              View Stats
            </a>
          </div>
          
          <div className="fitness-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚙️</span>
            </div>
            <h3 className="font-semibold text-xl mb-2">Settings</h3>
            <p className="text-gray-400 mb-4">Customize your experience</p>
            <a href="/settings" className="fitness-button inline-block">
              Configure
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { user } = useAppStore();

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/plans" component={Plans} />
      <Route path="/workout" component={Workout} />
      <Route path="/progress" component={Progress} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { user } = useAppStore();

  useEffect(() => {
    // Request notification permission on app start
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
