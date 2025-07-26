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
import { Button } from "@/components/ui/button";
import { Play, Music, TrendingUp, Target, Zap, Headphones } from "lucide-react";
import { AuthModals } from "@/components/auth-modals";

function Dashboard() {
  const { user } = useAppStore();
  
  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/rhythmrep-logo.png" 
                alt="RhythmRep Logo" 
                className="w-20 h-20 object-contain rounded-xl shadow-2xl"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              RhythmRep
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Where <span className="text-orange-400 font-semibold">workouts</span> meet <span className="text-purple-400 font-semibold">music</span>. 
              Train with rhythm, track with precision, and transform your fitness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Start Your Workout
                  </Button>
                  <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-3 text-lg">
                    <Music className="mr-2 h-5 w-5" />
                    Explore Music
                  </Button>
                </>
              ) : (
                <AuthModals />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose RhythmRep?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The perfect blend of fitness tracking and musical motivation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Rhythm-Based Training</h3>
              <p className="text-gray-400">
                Sync your workouts with music beats for maximum motivation and performance. 
                Every rep, every set, perfectly timed to your favorite tracks.
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Music Integration</h3>
              <p className="text-gray-400">
                Intelligent playlist generation based on your workout intensity, 
                mood, and preferences. Never train in silence again.
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Advanced Analytics</h3>
              <p className="text-gray-400">
                Track your progress with detailed analytics, performance metrics, 
                and personalized insights to optimize your training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-400">Choose your path to fitness excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-8 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Start Workout</h3>
                <p className="text-gray-300 mb-6">Jump into a high-energy training session with perfectly curated music</p>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Begin Training
                </Button>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">View Progress</h3>
                <p className="text-gray-300 mb-6">Analyze your performance and celebrate your achievements</p>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Check Stats
                </Button>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-8 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Music Library</h3>
                <p className="text-gray-300 mb-6">Discover workout playlists and create your perfect training soundtrack</p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Explore Music
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Transform Your Fitness Journey</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of athletes who've discovered the power of rhythm-based training
          </p>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-3 text-lg">
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/rhythmrep-logo.png" 
                  alt="RhythmRep Logo" 
                  className="w-10 h-10 object-contain rounded-lg"
                />
                <span className="font-bold text-xl">RhythmRep</span>
              </div>
              <p className="text-gray-400 mb-6">
                Where workouts meet music. Transform your fitness journey with rhythm-based training and intelligent music integration.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-4">
                <li><a href="/workout" className="text-gray-400 hover:text-orange-400 transition-colors">Workout Player</a></li>
                <li><a href="/progress" className="text-gray-400 hover:text-orange-400 transition-colors">Progress Tracking</a></li>
                <li><a href="/plans" className="text-gray-400 hover:text-orange-400 transition-colors">Training Plans</a></li>
                <li><a href="/onboarding" className="text-gray-400 hover:text-orange-400 transition-colors">Get Started</a></li>
                <li><a href="/settings" className="text-gray-400 hover:text-orange-400 transition-colors">Settings</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-4">
                <li><a href="/" className="text-gray-400 hover:text-orange-400 transition-colors">Home</a></li>
                <li><a href="/workout" className="text-gray-400 hover:text-orange-400 transition-colors">Workouts</a></li>
                <li><a href="/progress" className="text-gray-400 hover:text-orange-400 transition-colors">Analytics</a></li>
                <li><a href="/plans" className="text-gray-400 hover:text-orange-400 transition-colors">Plans</a></li>
                <li><a href="/onboarding" className="text-gray-400 hover:text-orange-400 transition-colors">Onboarding</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4">
                <li><a href="/settings" className="text-gray-400 hover:text-orange-400 transition-colors">Settings</a></li>
                <li><a href="/onboarding" className="text-gray-400 hover:text-orange-400 transition-colors">Help & Guide</a></li>
                <li><a href="/progress" className="text-gray-400 hover:text-orange-400 transition-colors">Progress Help</a></li>
                <li><a href="/workout" className="text-gray-400 hover:text-orange-400 transition-colors">Workout Help</a></li>
                <li><a href="/plans" className="text-gray-400 hover:text-orange-400 transition-colors">Plan Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 RhythmRep. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Cookies</a>
                <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">Settings</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
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
