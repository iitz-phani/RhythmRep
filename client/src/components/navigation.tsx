import { Link, useLocation } from "wouter";
import { Home, Play, TrendingUp, Settings, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthModals } from "./auth-modals";
import { useAppStore } from "@/lib/store";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAppStore();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/workout", label: "Workout", icon: Play },
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link key={path} href={path}>
          <Button
            variant={location === path ? "default" : "ghost"}
            className={`${mobile ? "w-full justify-start" : ""} ${
              location === path
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "text-gray-300 hover:text-primary"
            }`}
            onClick={() => mobile && setIsOpen(false)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        </Link>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <img 
                  src="/rhythmrep-logo.png" 
                  alt="RhythmRep Logo" 
                  className="w-12 h-12 object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks />
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">{user.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUser(null)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <AuthModals />
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 border-gray-700">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks mobile />
                  
                  {/* Mobile Auth Section */}
                  <div className="pt-4 border-t border-gray-700">
                    {user ? (
                      <div className="space-y-3">
                        <div className="text-sm text-gray-300 px-3">{user.email}</div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-400 hover:text-red-400"
                          onClick={() => setUser(null)}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="px-3">
                        <AuthModals />
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-800 border-t border-gray-700 z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} href={path}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-2 px-4 h-auto ${
                  location === path ? "text-primary" : "text-gray-400"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
