import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, Dumbbell, Target, Clock, Calendar, TrendingUp, Plus, Zap, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { buildApiUrl } from "@/lib/config";
import { CustomPlanModal } from "@/components/custom-plan-modal";
import { useState } from "react";

const planIcons = {
  "Cardio": Heart,
  "Push-Pull": Dumbbell,
  "Isolated": Target,
  "Combination": TrendingUp,
  "Full Body": Zap,
  "Upper/Lower": TrendingUp,
};

const planColors = {
  "Cardio": "from-red-500 to-pink-500",
  "Push-Pull": "from-orange-500 to-red-500",
  "Isolated": "from-purple-500 to-indigo-500",
  "Combination": "from-blue-500 to-cyan-500",
  "Full Body": "from-green-500 to-emerald-500",
  "Upper/Lower": "from-violet-500 to-purple-500",
};

export default function Plans() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setCurrentPlan } = useAppStore();
  const [isCustomPlanModalOpen, setIsCustomPlanModalOpen] = useState(false);

  const { data: plans, isLoading, error } = useQuery({
    queryKey: [buildApiUrl("/api/plans")],
    onSuccess: (data) => {
      console.log("Plans loaded successfully:", data);
    },
    onError: (error) => {
      console.error("Error loading plans:", error);
    },
  });

  const selectPlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest("POST", buildApiUrl("/api/plan/select"), {
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

  const handleCustomPlanCreated = (newPlan: any) => {
    // Refresh the plans query to include the new custom plan
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <Navigation />
        <div className="max-w-7xl mx-auto p-4 pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading workout plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <Navigation />
        <div className="max-w-7xl mx-auto p-4 pt-8">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">Error loading workout plans</div>
            <p className="text-gray-400">Please try refreshing the page or contact support.</p>
            <pre className="text-xs text-gray-500 mt-4 bg-gray-800 p-4 rounded">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Choose Your Workout Plan
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Select a plan that matches your <span className="text-orange-400 font-semibold">goals</span> and 
              <span className="text-purple-400 font-semibold"> experience level</span>
            </p>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!plans || plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-xl mb-4">No workout plans available</div>
              <p className="text-gray-500">Please check back later or contact support.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan: any, index: number) => {
                const IconComponent = planIcons[plan.splitType as keyof typeof planIcons] || Dumbbell;
                const colorClass = planColors[plan.splitType as keyof typeof planColors] || "from-gray-500 to-gray-600";
                const schedule = JSON.parse(plan.scheduleJson || "[]");
                const workoutDays = schedule.filter((day: any) => day.type !== "Rest").length;
                
                // Center the Upper/Lower split card by adding special styling
                const isUpperLower = plan.splitType === "Upper/Lower";
                const gridClass = isUpperLower ? "md:col-span-2 lg:col-span-1 md:col-start-1 lg:col-start-2" : "";
                
                return (
                  <div 
                    key={plan.id} 
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer ${gridClass}`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="text-white text-2xl" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`
                            ${plan.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                            ${plan.difficulty === 'Intermediate' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : ''}
                            ${plan.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                          `}
                        >
                          {plan.difficulty}
                        </Badge>
                      </div>
                      
                      {/* Title and Description */}
                      <h3 className="font-bold text-2xl mb-3 text-white">{plan.name}</h3>
                      <p className="text-gray-300 mb-6 line-clamp-3">
                        {plan.splitType === "Push-Pull" && "Balanced strength training focusing on opposing muscle groups for optimal growth and recovery"}
                        {plan.splitType === "Cardio" && "High-intensity interval training designed for maximum calorie burn and cardiovascular fitness"}
                        {plan.splitType === "Isolated" && "Target specific muscle groups each day for maximum hypertrophy and definition"}
                        {plan.splitType === "Combination" && "Mix of strength and cardio for complete fitness transformation"}
                        {plan.splitType === "Full Body" && "Complete full-body workouts perfect for beginners and time-efficient training"}
                        {plan.splitType === "Upper/Lower" && "Split training focusing on upper and lower body separation for balanced development"}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center text-sm text-gray-300">
                          <Clock className="w-4 h-4 mr-3 text-orange-400" />
                          <span>45-60 min sessions</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="w-4 h-4 mr-3 text-purple-400" />
                          <span>{workoutDays} days per week</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <TrendingUp className="w-4 h-4 mr-3 text-blue-400" />
                          <span>{plan.equipmentRequired}</span>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <Button
                        className={`w-full bg-gradient-to-r ${colorClass} hover:shadow-lg hover:shadow-orange-500/25 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-[1.02]`}
                        disabled={selectPlanMutation.isPending}
                      >
                        {selectPlanMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Selecting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Select Plan
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Custom Plan CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Need Something Custom?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Create your own personalized workout plan tailored to your specific needs
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 text-lg"
            onClick={() => setIsCustomPlanModalOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Custom Plan
          </Button>
        </div>
      </section>

      {/* Custom Plan Modal */}
      <CustomPlanModal
        isOpen={isCustomPlanModalOpen}
        onClose={() => setIsCustomPlanModalOpen(false)}
        onPlanCreated={handleCustomPlanCreated}
      />
    </div>
  );
}
