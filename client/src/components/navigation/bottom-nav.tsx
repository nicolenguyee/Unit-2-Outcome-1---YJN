import { Home, PillBottle, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/", testId: "button-nav-home" },
    { icon: PillBottle, label: "Medications", path: "/medications", testId: "button-nav-medications" },
    { icon: Heart, label: "Health", path: "/health", testId: "button-nav-health" },
    { icon: User, label: "Profile", path: "/profile", testId: "button-nav-profile" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4 md:hidden" 
      role="navigation" 
      aria-label="Bottom navigation"
    >
      <div className="flex justify-around">
        {navItems.map(({ icon: Icon, label, path, testId }) => (
          <Button
            key={path}
            variant="ghost"
            onClick={() => setLocation(path)}
            className={`flex flex-col items-center space-y-2 p-3 rounded-lg ${
              location === path 
                ? "bg-medical-green text-white" 
                : "text-gray-600 hover:bg-gray-100"
            }`}
            data-testid={testId}
          >
            <Icon className="text-2xl" aria-hidden="true" />
            <span className="text-sm font-semibold">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
