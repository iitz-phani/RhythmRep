import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { ProgressCharts } from "@/components/progress-charts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { 
  TrendingUp, 
  Trophy, 
  Calendar, 
  Clock, 
  Weight, 
  Flame, 
  Download,
  Dumbbell,
  Target
} from "lucide-react";

export default function Progress() {
  const { user } = useAppStore();

  const { data: progressData, isLoading } = useQuery({
    queryKey: [`/api/progress/summary/${user?.id || 1}`],
    enabled: !!user?.id,
  });

  // Mock data for charts since we don't have enough real data yet
  const volumeData = [
    { date: "Mon", volume: 2400 },
    { date: "Tue", volume: 2800 },
    { date: "Wed", volume: 3200 },
    { date: "Thu", volume: 2900 },
    { date: "Fri", volume: 3400 },
    { date: "Sat", volume: 3100 },
    { date: "Sun", volume: 2600 },
  ];

  const weightData = [
    { date: "Week 1", weight: 180 },
    { date: "Week 2", weight: 179 },
    { date: "Week 3", weight: 178 },
    { date: "Week 4", weight: 177 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <Navigation />
        <div className="max-w-6xl mx-auto p-4 pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading progress data...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = progressData?.stats || {
    currentStreak: 0,
    totalVolume: 0,
    totalSets: 0,
    totalWorkouts: 0,
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-20 md:pb-8">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 pt-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-bold text-4xl mb-2">Your Progress</h1>
            <p className="text-gray-400">Track your fitness journey and celebrate achievements</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Select defaultValue="30days">
              <SelectTrigger className="bg-gray-800 border-gray-600 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Flame className="text-primary text-xl" />
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  +12%
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.currentStreak}</div>
              <div className="text-gray-400 text-sm">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Weight className="text-secondary text-xl" />
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  +8%
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalVolume.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Total Volume (lbs)</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Clock className="text-accent text-xl" />
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  +15%
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{Math.round(stats.totalWorkouts * 0.75)}</div>
              <div className="text-gray-400 text-sm">Hours Trained</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Trophy className="text-success text-xl" />
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  New!
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{Math.min(stats.totalWorkouts, 7)}</div>
              <div className="text-gray-400 text-sm">Personal Records</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <ProgressCharts volumeData={volumeData} weightData={weightData} />

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Recent Workouts */}
          <div className="lg:col-span-2">
            <Card className="fitness-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-xl">Recent Workouts</h3>
                  <Button variant="ghost" className="text-gray-400 hover:text-primary">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {progressData?.recentProgress?.slice(0, 5).map((progress: any, index: number) => (
                    <div key={index} className="bg-gray-700 rounded-xl p-4 hover:bg-gray-900 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Dumbbell className="text-primary w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold">Exercise Session</div>
                            <div className="text-sm text-gray-400">{progress.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{((progress.weightUsed || 0) * progress.repsDone).toFixed(0)} lbs</div>
                          <div className="text-sm text-secondary">{progress.setsDone} sets</div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-400">
                      <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent workouts found</p>
                      <p className="text-sm">Start exercising to see your progress here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <Card className="fitness-card">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-6">Achievements</h3>
                <div className="space-y-4">
                  {stats.totalWorkouts > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-success to-secondary rounded-full flex items-center justify-center">
                        <Trophy className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">First Workout</div>
                        <div className="text-xs text-gray-400">Great start!</div>
                      </div>
                    </div>
                  )}
                  
                  {stats.currentStreak >= 3 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <Flame className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">3-Day Streak</div>
                        <div className="text-xs text-gray-400">Keep it up!</div>
                      </div>
                    </div>
                  )}

                  {stats.totalSets >= 10 && (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                        <Target className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">10 Sets Complete</div>
                        <div className="text-xs text-gray-400">Building strength!</div>
                      </div>
                    </div>
                  )}

                  {/* Future achievement */}
                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <Calendar className="text-gray-600 w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-400">7-Day Streak</div>
                      <div className="text-xs text-gray-500">
                        {7 - stats.currentStreak > 0 ? `${7 - stats.currentStreak} days to go` : "Unlocked!"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
