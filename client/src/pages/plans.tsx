import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, Dumbbell, Target, Clock, Calendar, TrendingUp, Plus } from "lucide-react";
import { Navigation } from "@/components/navigation";

const planIcons = {
  "Cardio": Heart,
  "Push-Pull": Dumbbell,
  "Isolated": Target,
  "Combination": TrendingUp,
};

export default function Plans() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setCurrentPlan } = useAppStore();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/plans"],
  });

  const selectPlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest("POST", "/api/plan/select", {
        userId: user?.id || 1, // TODO: Get from auth context
        planId,
      });
      return response.json();
    },
    onSuccess: (userPlan) => {
      toast({
        title: "Plan Selected!",
        description: "Your workout plan has been activated.",
      });
      setLocation("/workout");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to select plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (plan: any) => {
    setCurrentPlan(plan);
    selectPlanMutation.mutate(plan.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <Navigation />
        <div className="max-w-6xl mx-auto p-4 pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading workout plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-20 md:pb-8">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 pt-8">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl mb-4">Choose Your Workout Plan</h1>
          <p className="text-gray-400 text-lg">Select a plan that matches your goals and experience level</p>
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans?.map((plan: any) => {
            const IconComponent = planIcons[plan.splitType as keyof typeof planIcons] || Dumbbell;
            const schedule = JSON.parse(plan.scheduleJson || "[]");
            const workoutDays = schedule.filter((day: any) => day.type !== "Rest").length;
            
            return (
              <Card 
                key={plan.id} 
                className="fitness-card hover:bg-gray-700 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <IconComponent className="text-white text-xl" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${plan.difficulty === 'Beginner' ? 'bg-success/10 text-success' : ''}
                        ${plan.difficulty === 'Intermediate' ? 'bg-primary/10 text-primary' : ''}
                        ${plan.difficulty === 'Advanced' ? 'bg-error/10 text-error' : ''}
                      `}
                    >
                      {plan.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {plan.splitType === "Push-Pull" && "Balanced strength training focusing on opposing muscle groups"}
                    {plan.splitType === "Cardio" && "High-intensity interval training for maximum calorie burn"}
                    {plan.splitType === "Isolated" && "Target specific muscle groups each day for maximum growth"}
                    {plan.splitType === "Combination" && "Mix of strength and cardio for complete fitness"}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-secondary" />
                      <span>45-60 min sessions</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-secondary" />
                      <span>{workoutDays} days per week</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <TrendingUp className="w-4 h-4 mr-2 text-secondary" />
                      <span>{plan.equipmentRequired}</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full fitness-button group-hover:shadow-lg"
                    onClick={() => handleSelectPlan(plan)}
                    disabled={selectPlanMutation.isPending}
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Custom Plan Option */}
        <div className="text-center">
          <Button
            variant="outline"
            className="border-dashed border-2 border-gray-600 hover:border-primary bg-transparent px-8 py-4 h-auto"
            disabled
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Custom Plan
            <Badge variant="secondary" className="ml-2">Coming Soon</Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}
