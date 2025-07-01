import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Dumbbell, 
  Music, 
  Heart, 
  Save, 
  Info,
  Volume2,
  Bluetooth,
  Bell
} from "lucide-react";

export default function Settings() {
  const { user, setUser } = useAppStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    heightCm: user?.heightCm || "",
    weightKg: user?.weightKg || "",
    age: user?.age || "",
    fitnessLevel: user?.fitnessLevel || "Intermediate",
    goal: user?.goal || "Build",
    equipment: user?.equipment || "Full Gym",
    defaultRestTime: 90,
    autoAdvance: true,
    soundNotifications: true,
    musicService: "Spotify",
    preferredGenres: ["Electronic", "Hip Hop"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/profile/${user?.id}`, data);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const updateData = {
      heightCm: formData.heightCm ? parseInt(formData.heightCm.toString()) : undefined,
      weightKg: formData.weightKg ? parseFloat(formData.weightKg.toString()) : undefined,
      age: formData.age ? parseInt(formData.age.toString()) : undefined,
      fitnessLevel: formData.fitnessLevel,
      goal: formData.goal,
      equipment: formData.equipment,
      musicPrefJson: JSON.stringify({ 
        service: formData.musicService,
        genres: formData.preferredGenres 
      }),
    };

    updateProfileMutation.mutate(updateData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGenre = (genre: string) => {
    const genres = formData.preferredGenres.includes(genre)
      ? formData.preferredGenres.filter(g => g !== genre)
      : [...formData.preferredGenres, genre];
    updateFormData("preferredGenres", genres);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-20 md:pb-8">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h1 className="font-bold text-4xl mb-2">Settings</h1>
          <p className="text-gray-400">Customize your FitFlow experience</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => updateFormData("heightCm", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="175"
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => updateFormData("weightKg", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="75"
                  />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="28"
                  />
                </div>
                <div>
                  <Label>Fitness Level</Label>
                  <Select value={formData.fitnessLevel} onValueChange={(value) => updateFormData("fitnessLevel", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fitness Goal</Label>
                  <Select value={formData.goal} onValueChange={(value) => updateFormData("goal", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lose">Lose Weight</SelectItem>
                      <SelectItem value="Build">Build Muscle</SelectItem>
                      <SelectItem value="Maintain">Maintain Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Equipment Access</Label>
                  <Select value={formData.equipment} onValueChange={(value) => updateFormData("equipment", value)}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home/Bodyweight</SelectItem>
                      <SelectItem value="Dumbbells">Home with Dumbbells</SelectItem>
                      <SelectItem value="Full Gym">Full Gym Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Preferences */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="w-5 h-5" />
                <span>Workout Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Default Rest Time (seconds)</Label>
                <div className="flex space-x-4">
                  {[60, 90, 120, 180].map((seconds) => (
                    <Button
                      key={seconds}
                      variant={formData.defaultRestTime === seconds ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFormData("defaultRestTime", seconds)}
                      className={formData.defaultRestTime === seconds ? "bg-primary" : "border-gray-600 hover:border-primary"}
                    >
                      {seconds}s
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Auto-advance exercises</div>
                  <div className="text-sm text-gray-400">Automatically move to next exercise after rest period</div>
                </div>
                <Switch
                  checked={formData.autoAdvance}
                  onCheckedChange={(checked) => updateFormData("autoAdvance", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Sound notifications</span>
                  </div>
                  <div className="text-sm text-gray-400">Play sounds for timers and alerts</div>
                </div>
                <Switch
                  checked={formData.soundNotifications}
                  onCheckedChange={(checked) => updateFormData("soundNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Music Settings */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Music className="w-5 h-5" />
                <span>Music Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Music Service</Label>
                <Select value={formData.musicService} onValueChange={(value) => updateFormData("musicService", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YouTube Music">YouTube Music</SelectItem>
                    <SelectItem value="Spotify">Spotify</SelectItem>
                    <SelectItem value="Apple Music">Apple Music</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Preferred Genres</Label>
                <div className="flex flex-wrap gap-2">
                  {["Electronic", "Hip Hop", "Rock", "Pop", "Reggaeton", "EDM"].map((genre) => (
                    <Button
                      key={genre}
                      variant={formData.preferredGenres.includes(genre) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleGenre(genre)}
                      className={`${
                        formData.preferredGenres.includes(genre)
                          ? "bg-primary hover:bg-primary/80"
                          : "border-gray-600 hover:border-primary"
                      }`}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wearable Integration */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Wearable Devices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Bluetooth className="text-accent w-5 h-5" />
                  <div>
                    <div className="font-medium">Heart Rate Monitor</div>
                    <div className="text-sm text-gray-400">No device connected</div>
                  </div>
                </div>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white" disabled>
                  Connect
                </Button>
              </div>
              <div className="flex items-start space-x-2 mt-4 p-3 bg-accent/10 rounded-lg">
                <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="text-xs text-accent">
                  Web Bluetooth support required for wireless heart rate monitors. This feature is currently in development.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="text-center">
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="fitness-button text-lg px-8 py-4"
            >
              <Save className="w-5 h-5 mr-2" />
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
