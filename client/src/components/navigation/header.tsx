import { Heart, Phone, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user } = useAuth();

  const handleEmergency = () => {
    // TODO: Implement emergency contacts modal
    alert("Emergency contacts feature coming soon!");
  };

  const handleProfile = () => {
    window.location.href = "/profile";
  };

  return (
    <header className="bg-white shadow-md border-b-2 border-medical-green" role="banner">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-medical-green rounded-lg flex items-center justify-center">
              <Heart className="text-white text-xl" aria-hidden="true" />
            </div>
            <h1 className="text-elderly-title font-bold text-medical-green">Boomerang</h1>
            <span className="text-elderly-body text-gray-600 hidden md:inline">Healthcare Companion</span>
          </div>
          
          <nav className="flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            <Button
              variant="ghost"
              onClick={handleEmergency}
              className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-100"
              data-testid="button-emergency"
            >
              <Phone className="text-error-red text-xl" aria-hidden="true" />
              <span className="text-elderly-body font-semibold text-error-red">Emergency</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleProfile}
              className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-100"
              data-testid="button-profile"
            >
              <UserCircle className="text-trust-blue text-2xl" aria-hidden="true" />
              <span className="text-elderly-body text-trust-blue" data-testid="text-user-name">
                {(user as any)?.firstName || "User"}
              </span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
