import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { buildApiUrl } from "@/lib/config";
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Music, Dumbbell, Zap, Sparkles, ArrowRight, TrendingUp } from "lucide-react";

// Google Sign-In component
const GoogleSignInButton = ({ onSuccess, onError }: { onSuccess: (user: any) => void; onError: (error: any) => void }) => {
  const handleGoogleSignIn = async () => {
    try {
      // For now, we'll simulate Google OAuth
      // In production, you'd integrate with Google OAuth 2.0
      const response = await fetch(buildApiUrl('/api/auth/google'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const user = await response.json();
        onSuccess(user);
      } else {
        throw new Error('Google sign-in failed');
      }
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
      onClick={handleGoogleSignIn}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </Button>
  );
};

// Validation schemas
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

export function AuthModals() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { setUser } = useAppStore();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const signInMutation = useMutation({
    mutationFn: async (data: SignInForm) => {
      const response = await apiRequest("POST", buildApiUrl("/api/auth/signin"), data);
      return response.json();
    },
    onSuccess: (user) => {
      setUser(user);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to RhythmRep.",
      });
      setIsOpen(false);
      signInForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Sign in failed",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpForm) => {
      const response = await apiRequest("POST", buildApiUrl("/api/auth/signup"), {
        email: data.email,
        passwordHash: data.password,
      });
      return response.json();
    },
    onSuccess: (user) => {
      setUser(user);
      toast({
        title: "Account created!",
        description: "Welcome to RhythmRep. Let's set up your profile.",
      });
      setIsOpen(false);
      signUpForm.reset();
      window.location.href = "/onboarding";
    },
    onError: (error) => {
      toast({
        title: "Sign up failed",
        description: "Please try again with a different email.",
        variant: "destructive",
      });
    },
  });

  const onSignIn = (data: SignInForm) => {
    signInMutation.mutate(data);
  };

  const onSignUp = (data: SignUpForm) => {
    signUpMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 hover:from-orange-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          Get Started
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-transparent border-0">
        <div className="relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8">
            <DialogHeader className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/rhythmrep-logo.png" 
                  alt="RhythmRep Logo" 
                  className="w-16 h-16 object-contain rounded-2xl shadow-2xl"
                />
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Welcome to RhythmRep
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-lg mt-2">
                Where workouts meet music. Start your fitness journey today.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
                <TabsTrigger 
                  value="signin" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6 mt-6">
                {/* Google Sign-In */}
                <div className="space-y-4">
                  <GoogleSignInButton 
                    onSuccess={(user) => {
                      setUser(user);
                      toast({
                        title: "Welcome back!",
                        description: "Successfully signed in with Google.",
                      });
                      setIsOpen(false);
                    }}
                    onError={(error) => {
                      toast({
                        title: "Google sign-in failed",
                        description: "Please try again or use email sign-in.",
                        variant: "destructive",
                      });
                    }}
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-300 font-medium">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 pr-4 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-xl focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300"
                        {...signInForm.register("email")}
                      />
                    </div>
                    {signInForm.formState.errors.email && (
                      <p className="text-sm text-red-400">{signInForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-300 font-medium">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-xl focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300"
                        {...signInForm.register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-700/50 rounded-lg"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-red-400">{signInForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={signInMutation.isPending}
                  >
                    {signInMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-6">
                {/* Google Sign-Up */}
                <div className="space-y-4">
                  <GoogleSignInButton 
                    onSuccess={(user) => {
                      setUser(user);
                      toast({
                        title: "Account created!",
                        description: "Welcome to RhythmRep. Let's set up your profile.",
                      });
                      setIsOpen(false);
                      window.location.href = "/onboarding";
                    }}
                    onError={(error) => {
                      toast({
                        title: "Google sign-up failed",
                        description: "Please try again or use email sign-up.",
                        variant: "destructive",
                      });
                    }}
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-300 font-medium">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 pr-4 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                        {...signUpForm.register("email")}
                      />
                    </div>
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-red-400">{signUpForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-300 font-medium">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-12 pr-12 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                        {...signUpForm.register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-700/50 rounded-lg"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-red-400">{signUpForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-gray-300 font-medium">Confirm Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-12 pr-12 py-3 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                        {...signUpForm.register("confirmPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-700/50 rounded-lg"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-400">{signUpForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={signUpMutation.isPending}
                  >
                    {signUpMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      onClick={() => setActiveTab("signin")}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>


          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 