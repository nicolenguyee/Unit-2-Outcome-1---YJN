import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Clock, Users } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
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
            
            <Button 
              onClick={handleLogin}
              className="bg-medical-green hover:bg-medical-green/90 text-white px-8 py-4 text-elderly-body font-semibold"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12" role="main">
        {/* Hero Section */}
        <section className="text-center mb-16" aria-labelledby="hero-heading">
          <h2 id="hero-heading" className="text-elderly-large font-bold text-text-primary mb-6">
            Your Trusted Healthcare Companion
          </h2>
          <p className="text-elderly-body text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Boomerang helps you manage your medications, track your health, and access trusted medical information. 
            Designed specifically for seniors with large fonts, simple navigation, and clear instructions.
          </p>
          <Button 
            onClick={handleLogin}
            className="bg-medical-green hover:bg-medical-green/90 text-white px-12 py-6 text-elderly-heading font-semibold"
            data-testid="button-get-started"
          >
            Get Started Today
          </Button>
        </section>

        {/* Features Section */}
        <section className="mb-16" aria-labelledby="features-heading">
          <h3 id="features-heading" className="text-elderly-title font-bold text-medical-green mb-8 text-center">
            Everything You Need for Better Health
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-gray-100 hover:border-medical-green transition-colors duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-medical-green rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-white text-2xl" aria-hidden="true" />
                </div>
                <h4 className="text-elderly-heading font-bold mb-3">Medication Reminders</h4>
                <p className="text-elderly-body text-gray-600 leading-relaxed">
                  Never miss a dose with gentle reminders and easy tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-trust-blue transition-colors duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-trust-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-white text-2xl" aria-hidden="true" />
                </div>
                <h4 className="text-elderly-heading font-bold mb-3">Health Tracking</h4>
                <p className="text-elderly-body text-gray-600 leading-relaxed">
                  Monitor blood pressure, heart rate, and other vital signs
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-success-green transition-colors duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-success-green rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white text-2xl" aria-hidden="true" />
                </div>
                <h4 className="text-elderly-heading font-bold mb-3">Trusted Information</h4>
                <p className="text-elderly-body text-gray-600 leading-relaxed">
                  Access verified health tips from certified medical professionals
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-alert-orange transition-colors duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-alert-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white text-2xl" aria-hidden="true" />
                </div>
                <h4 className="text-elderly-heading font-bold mb-3">Family Connection</h4>
                <p className="text-elderly-body text-gray-600 leading-relaxed">
                  Share your health progress with loved ones and caregivers
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-16" aria-labelledby="accessibility-heading">
          <div className="bg-gradient-to-r from-medical-green to-trust-blue rounded-2xl p-8 text-white">
            <h3 id="accessibility-heading" className="text-elderly-title font-bold mb-6 text-center">
              Built for Seniors, By Healthcare Experts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-elderly-large font-bold mb-2">Large Text</div>
                <p className="text-elderly-body">Easy-to-read fonts and high contrast colors</p>
              </div>
              
              <div className="text-center">
                <div className="text-elderly-large font-bold mb-2">Simple Design</div>
                <p className="text-elderly-body">Clear navigation with minimal distractions</p>
              </div>
              
              <div className="text-center">
                <div className="text-elderly-large font-bold mb-2">Voice Support</div>
                <p className="text-elderly-body">Compatible with screen readers and voice control</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center" aria-labelledby="cta-heading">
          <Card className="border-2 border-medical-green">
            <CardContent className="p-12">
              <h3 id="cta-heading" className="text-elderly-title font-bold text-medical-green mb-4">
                Ready to Take Control of Your Health?
              </h3>
              <p className="text-elderly-body text-gray-600 mb-8 leading-relaxed">
                Join thousands of seniors who trust Boomerang for their daily health management.
              </p>
              <Button 
                onClick={handleLogin}
                className="bg-medical-green hover:bg-medical-green/90 text-white px-12 py-6 text-elderly-heading font-semibold"
                data-testid="button-sign-in-cta"
              >
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Screen reader content */}
      <div className="sr-only">
        <h1>Boomerang Healthcare Application Landing Page</h1>
        <p>
          Boomerang is a healthcare companion app designed specifically for elderly users. 
          It provides medication reminders, health tracking, trusted medical information, 
          and family connectivity features with accessibility-first design.
        </p>
      </div>
    </div>
  );
}
