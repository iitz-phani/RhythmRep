import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { buildApiUrl } from "@/lib/config";
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Zap, 
  Heart, 
  Brain, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface CustomPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: any) => void;
}

const splitTypes = [
  { value: "Push-Pull", label: "Push-Pull Split", icon: Dumbbell, description: "Balanced strength training" },
  { value: "Upper/Lower", label: "Upper/Lower Split", icon: Target, description: "Body part separation" },
  { value: "Full Body", label: "Full Body", icon: Zap, description: "Complete workouts" },
  { value: "Cardio", label: "Cardio Focus", icon: Heart, description: "Cardiovascular fitness" },
  { value: "Isolated", label: "Isolated Training", icon: Brain, description: "Target specific muscles" },
  { value: "Combination", label: "Strength + Cardio", icon: TrendingUp, description: "Mixed approach" },
];

const difficultyLevels = [
  { value: "Beginner", label: "Beginner", description: "New to fitness", color: "bg-green-500/20 text-green-400" },
  { value: "Intermediate", label: "Intermediate", description: "Some experience", color: "bg-orange-500/20 text-orange-400" },
  { value: "Advanced", label: "Advanced", description: "Experienced lifter", color: "bg-red-500/20 text-red-400" },
];

const goals = [
  { value: "Build", label: "Build Muscle", description: "Gain strength and size" },
  { value: "Cut", label: "Lose Fat", description: "Burn calories and tone" },
  { value: "Maintain", label: "Maintain", description: "Stay fit and healthy" },
];

const equipmentOptions = [
  { value: "Minimal", label: "Minimal Equipment", description: "Bodyweight + basic items" },
  { value: "Home Gym", label: "Home Gym", description: "Dumbbells + resistance bands" },
  { value: "Full Gym", label: "Full Gym", description: "Complete equipment access" },
];

const marketInsights = {
  "Push-Pull": {
    popularity: "Very Popular",
    effectiveness: "High",
    timeEfficiency: "Medium",
    recovery: "Good",
    marketTrend: "Growing",
    bestFor: "Intermediate lifters, muscle building",
    weeklyFrequency: "4-5 days",
    sessionDuration: "45-60 minutes"
  },
  "Upper/Lower": {
    popularity: "Popular",
    effectiveness: "High",
    timeEfficiency: "High",
    recovery: "Excellent",
    marketTrend: "Stable",
    bestFor: "All levels, balanced development",
    weeklyFrequency: "4 days",
    sessionDuration: "50-70 minutes"
  },
  "Full Body": {
    popularity: "Trending",
    effectiveness: "Medium-High",
    timeEfficiency: "Very High",
    recovery: "Good",
    marketTrend: "Rising",
    bestFor: "Beginners, busy schedules",
    weeklyFrequency: "3 days",
    sessionDuration: "60-75 minutes"
  },
  "Cardio": {
    popularity: "High",
    effectiveness: "High",
    timeEfficiency: "Very High",
    recovery: "Fast",
    marketTrend: "Stable",
    bestFor: "Fat loss, cardiovascular health",
    weeklyFrequency: "5-6 days",
    sessionDuration: "30-45 minutes"
  }
};

export function CustomPlanModal({ isOpen, onClose, onPlanCreated }: CustomPlanModalProps) {
  const { toast } = useToast();
  const { user } = useAppStore();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  const [planData, setPlanData] = useState({
    name: "",
    splitType: "",
    difficulty: "",
    goal: "",
    equipmentRequired: "",
    description: "",
    weeklyFrequency: "",
    sessionDuration: "",
    targetMuscles: [] as string[],
    specialFocus: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  const handleSplitTypeSelect = (splitType: string) => {
    setPlanData(prev => ({ 
      ...prev, 
      splitType,
      weeklyFrequency: marketInsights[splitType as keyof typeof marketInsights]?.weeklyFrequency || "",
      sessionDuration: marketInsights[splitType as keyof typeof marketInsights]?.sessionDuration || ""
    }));
  };

  const createCustomPlan = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a custom plan.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(buildApiUrl('/api/plans/custom'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...planData,
          userId: user.id,
          isCustom: true
        }),
      });

      if (response.ok) {
        const newPlan = await response.json();
        toast({
          title: "Custom Plan Created!",
          description: "Your personalized workout plan has been saved to your profile.",
        });
        onPlanCreated(newPlan);
        onClose();
        setStep(1);
        setPlanData({
          name: "",
          splitType: "",
          difficulty: "",
          goal: "",
          equipmentRequired: "",
          description: "",
          weeklyFrequency: "",
          sessionDuration: "",
          targetMuscles: [],
          specialFocus: ""
        });
      } else {
        throw new Error('Failed to create plan');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create custom plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Choose Your Split Type</h3>
        <p className="text-gray-400">Select the training style that best fits your goals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {splitTypes.map((split) => {
          const IconComponent = split.icon;
          const insights = marketInsights[split.value as keyof typeof marketInsights];
          
          return (
            <Card 
              key={split.value}
              className={`cursor-pointer transition-all duration-500 ease-out transform hover:scale-[1.02] hover:shadow-xl ${
                planData.splitType === split.value 
                  ? 'ring-2 ring-orange-500 bg-gradient-to-br from-orange-500/10 to-red-500/10 scale-[1.02] shadow-lg shadow-orange-500/25' 
                  : 'hover:bg-gray-800/50 hover:shadow-lg'
              }`}
              onClick={() => handleSplitTypeSelect(split.value)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{split.label}</h4>
                    <p className="text-gray-400 text-sm mb-3">{split.description}</p>
                    
                    {insights && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Popularity:</span>
                          <Badge variant="secondary" className="text-xs">
                            {insights.popularity}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Effectiveness:</span>
                          <Badge variant="secondary" className="text-xs">
                            {insights.effectiveness}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Best for:</span>
                          <span className="text-gray-300 text-xs">{insights.bestFor}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Plan Details</h3>
        <p className="text-gray-400">Customize your workout plan specifications</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              placeholder="e.g., My Custom Upper/Lower Split"
              value={planData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Difficulty Level</Label>
            <Select value={planData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center space-x-2">
                      <span>{level.label}</span>
                      <Badge className={level.color}>{level.description}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Primary Goal</Label>
            <Select value={planData.goal} onValueChange={(value) => handleInputChange('goal', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    <div className="flex items-center space-x-2">
                      <span>{goal.label}</span>
                      <span className="text-gray-400 text-sm">({goal.description})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Equipment Available</Label>
            <Select value={planData.equipmentRequired} onValueChange={(value) => handleInputChange('equipmentRequired', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment level" />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.map((equipment) => (
                  <SelectItem key={equipment.value} value={equipment.value}>
                    <div className="flex items-center space-x-2">
                      <span>{equipment.label}</span>
                      <span className="text-gray-400 text-sm">({equipment.description})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Weekly Frequency</Label>
            <Input
              placeholder="e.g., 4 days per week"
              value={planData.weeklyFrequency}
              onChange={(e) => handleInputChange('weeklyFrequency', e.target.value)}
            />
          </div>
          
          <div>
            <Label>Session Duration</Label>
            <Input
              placeholder="e.g., 60 minutes"
              value={planData.sessionDuration}
              onChange={(e) => handleInputChange('sessionDuration', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label>Special Focus Areas</Label>
        <Textarea
          placeholder="Any specific areas you want to focus on? (e.g., core strength, flexibility, endurance)"
          value={planData.specialFocus}
          onChange={(e) => handleInputChange('specialFocus', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Review Your Custom Plan</h3>
        <p className="text-gray-400">Confirm your plan details before creation</p>
      </div>
      
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-orange-500/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">{planData.name || "My Custom Plan"}</h4>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                Custom Plan
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Split Type:</span>
                <p className="text-white">{planData.splitType}</p>
              </div>
              <div>
                <span className="text-gray-400">Difficulty:</span>
                <p className="text-white">{planData.difficulty}</p>
              </div>
              <div>
                <span className="text-gray-400">Goal:</span>
                <p className="text-white">{planData.goal}</p>
              </div>
              <div>
                <span className="text-gray-400">Equipment:</span>
                <p className="text-white">{planData.equipmentRequired}</p>
              </div>
              <div>
                <span className="text-gray-400">Frequency:</span>
                <p className="text-white">{planData.weeklyFrequency}</p>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span>
                <p className="text-white">{planData.sessionDuration}</p>
              </div>
            </div>
            
            {planData.specialFocus && (
              <div>
                <span className="text-gray-400">Special Focus:</span>
                <p className="text-white">{planData.specialFocus}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h5 className="font-semibold text-blue-400 mb-1">Plan Benefits</h5>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Personalized to your goals and experience level</li>
              <li>• Based on current fitness market trends</li>
              <li>• Optimized for your available equipment</li>
              <li>• Saved to your profile for easy access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
            Create Your Custom Workout Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-out transform ${
                  step >= stepNumber 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-110 shadow-lg shadow-orange-500/25' 
                    : 'bg-gray-700 text-gray-400 scale-100'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-20 h-1 mx-3 rounded-full transition-all duration-700 ease-out ${
                    step > stepNumber 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-sm shadow-orange-500/25' 
                      : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Content */}
          <div className="relative">
            <div className={`transition-all duration-500 ease-out transform ${
              step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-0'
            }`}>
              {renderStep1()}
            </div>
            <div className={`transition-all duration-500 ease-out transform ${
              step === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-0'
            }`}>
              {renderStep2()}
            </div>
            <div className={`transition-all duration-500 ease-out transform ${
              step === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute inset-0'
            }`}>
              {renderStep3()}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 transform transition-all duration-300 hover:scale-105"
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !planData.splitType) ||
                    (step === 2 && (!planData.name || !planData.difficulty || !planData.goal || !planData.equipmentRequired))
                  }
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-orange-500/25"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button
                  onClick={createCustomPlan}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-green-500/25"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Custom Plan
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 