import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Target, Activity, Dumbbell, Scale } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

const steps = [
  { title: "Welcome", description: "Let's get started with your fitness journey" },
  { title: "Basic Info", description: "Tell us about yourself" },
  { title: "Fitness Goals", description: "What do you want to achieve?" },
  { title: "Fitness Level", description: "How would you rate your current fitness?" },
  { title: "Equipment", description: "What equipment do you have access to?" },
  { title: "Music Preferences", description: "What gets you motivated?" },
  { title: "Complete", description: "You're all set!" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    heightCm: "",
    weightKg: "",
    age: "",
    sex: "",
    fitnessLevel: "",
    goal: "",
    equipment: "",
    musicGenres: [] as string[],
    wearableProvider: "none",
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", "/api/profile", userData);
      return response.json();
    },
    onSuccess: (user) => {
      setUser(user);
      toast({
        title: "Profile Created!",
        description: "Welcome to FitFlow. Let's choose your workout plan.",
      });
      setLocation("/plans");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const userData = {
      email: formData.email,
      passwordHash: formData.password, // In real app, this would be hashed
      heightCm: formData.heightCm ? parseInt(formData.heightCm) : undefined,
      weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      sex: formData.sex,
      fitnessLevel: formData.fitnessLevel,
      goal: formData.goal,
      equipment: formData.equipment,
      musicPrefJson: JSON.stringify({ genres: formData.musicGenres }),
      wearableProvider: formData.wearableProvider,
    };

    createUserMutation.mutate(userData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.email && formData.password && formData.heightCm && formData.weightKg && formData.age;
      case 2: return formData.goal;
      case 3: return formData.fitnessLevel;
      case 4: return formData.equipment;
      case 5: return formData.musicGenres.length > 0;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Activity className="text-white text-4xl" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome to FitFlow</h2>
              <p className="text-gray-400">Your personal workout and music training companion</p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Basic Information</h2>
              <p className="text-gray-400">Help us personalize your experience</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => updateFormData("heightCm", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => updateFormData("weightKg", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label>Age</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label>Sex</Label>
                <Select value={formData.sex} onValueChange={(value) => updateFormData("sex", value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold mb-2">What's Your Goal?</h2>
              <p className="text-gray-400">Help us personalize your workout experience</p>
            </div>

            <RadioGroup value={formData.goal} onValueChange={(value) => updateFormData("goal", value)}>
              {[
                { value: "Lose", icon: "🔥", title: "Lose Weight", description: "Burn calories and reduce body fat" },
                { value: "Build", icon: "💪", title: "Build Muscle", description: "Increase strength and muscle mass" },
                { value: "Maintain", icon: "⚖️", title: "Maintain Fitness", description: "Stay healthy and active" },
              ].map((goal) => (
                <Card key={goal.value} className={`cursor-pointer transition-all duration-200 hover:scale-105 ${formData.goal === goal.value ? 'border-primary bg-primary/10' : 'border-gray-600 bg-gray-700 hover:border-primary'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value={goal.value} id={goal.value} />
                      <div className="text-3xl">{goal.icon}</div>
                      <div>
                        <Label htmlFor={goal.value} className="text-lg font-semibold cursor-pointer">
                          {goal.title}
                        </Label>
                        <p className="text-gray-400 text-sm">{goal.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Fitness Level</h2>
              <p className="text-gray-400">How would you rate your current fitness?</p>
            </div>

            <RadioGroup value={formData.fitnessLevel} onValueChange={(value) => updateFormData("fitnessLevel", value)}>
              {[
                { value: "Beginner", title: "Beginner", description: "New to regular exercise" },
                { value: "Intermediate", title: "Intermediate", description: "Exercise 2-3 times per week" },
                { value: "Advanced", title: "Advanced", description: "Exercise 4+ times per week" },
              ].map((level) => (
                <Card key={level.value} className={`cursor-pointer transition-all duration-200 hover:scale-105 ${formData.fitnessLevel === level.value ? 'border-primary bg-primary/10' : 'border-gray-600 bg-gray-700 hover:border-primary'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <div>
                        <Label htmlFor={level.value} className="text-lg font-semibold cursor-pointer">
                          {level.title}
                        </Label>
                        <p className="text-gray-400 text-sm">{level.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Equipment Access</h2>
              <p className="text-gray-400">What equipment do you have available?</p>
            </div>

            <RadioGroup value={formData.equipment} onValueChange={(value) => updateFormData("equipment", value)}>
              {[
                { value: "Home", title: "Home/Bodyweight", description: "No equipment needed" },
                { value: "Dumbbells", title: "Home with Dumbbells", description: "Basic home gym setup" },
                { value: "Full Gym", title: "Full Gym Access", description: "Complete gym equipment" },
              ].map((equipment) => (
                <Card key={equipment.value} className={`cursor-pointer transition-all duration-200 hover:scale-105 ${formData.equipment === equipment.value ? 'border-primary bg-primary/10' : 'border-gray-600 bg-gray-700 hover:border-primary'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value={equipment.value} id={equipment.value} />
                      <div>
                        <Label htmlFor={equipment.value} className="text-lg font-semibold cursor-pointer">
                          {equipment.title}
                        </Label>
                        <p className="text-gray-400 text-sm">{equipment.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎵</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Music Preferences</h2>
              <p className="text-gray-400">What music gets you motivated?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Electronic", "Hip Hop", "Rock", "Pop", "Reggaeton", "EDM"].map((genre) => (
                <Button
                  key={genre}
                  variant={formData.musicGenres.includes(genre) ? "default" : "outline"}
                  className={`h-auto py-4 ${formData.musicGenres.includes(genre) ? 'bg-primary hover:bg-primary/80' : 'border-gray-600 hover:border-primary'}`}
                  onClick={() => {
                    const genres = formData.musicGenres.includes(genre)
                      ? formData.musicGenres.filter(g => g !== genre)
                      : [...formData.musicGenres, genre];
                    updateFormData("musicGenres", genres);
                  }}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-4xl">✓</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">You're All Set! 🎉</h2>
              <p className="text-gray-400">Your profile has been created. Let's choose your first workout plan.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-secondary">{steps[currentStep].title}</span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>

        {/* Onboarding Card */}
        <Card className="fitness-card animate-fade-in">
          <CardContent className="p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-gray-600 hover:border-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || createUserMutation.isPending}
                className="fitness-button"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
