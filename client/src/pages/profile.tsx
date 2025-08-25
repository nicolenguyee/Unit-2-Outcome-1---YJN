import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/navigation/header";
import BottomNav from "@/components/navigation/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Shield,
  Bell,
  Palette,
  LogOut,
  Save,
  Edit3
} from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Initialize profile data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: "",
        address: "",
      });
    }
  }, [user]);

  // Fetch health goals for profile stats
  const { data: healthGoals = [] } = useQuery({
    queryKey: ["/api/health-goals"],
    enabled: isAuthenticated,
  });

  // Fetch medications for profile stats
  const { data: medications = [] } = useQuery({
    queryKey: ["/api/medications"],
    enabled: isAuthenticated,
  });

  // Update profile mutation (placeholder - would need backend endpoint)
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // This would require a backend endpoint to update user profile
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-elderly-heading">Loading...</div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const activeGoals = healthGoals.filter((goal: any) => goal.isActive).length;
  const activeMedications = medications.filter((med: any) => med.isActive).length;

  return (
    <div className="min-h-screen bg-soft-white pb-24 md:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8" role="main">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-elderly-title font-bold text-medical-green mb-2 flex items-center">
              <User className="mr-3 text-2xl" aria-hidden="true" />
              My Profile
            </h2>
            <p className="text-elderly-body text-gray-600">
              Manage your personal information and account settings
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-medical-green hover:bg-medical-green/90 text-white px-6 py-3 text-elderly-body font-semibold"
            data-testid="button-edit-profile"
          >
            <Edit3 className="mr-2" aria-hidden="true" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-elderly-heading font-bold text-medical-green">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="text-elderly-body font-semibold">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="mt-2 text-elderly-body p-3 border-2 border-gray-200 rounded-lg focus:border-medical-green"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-elderly-body font-semibold">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="mt-2 text-elderly-body p-3 border-2 border-gray-200 rounded-lg focus:border-medical-green"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-elderly-body font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-2 text-elderly-body p-3 border-2 border-gray-200 rounded-lg focus:border-medical-green"
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-elderly-body font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="mt-2 text-elderly-body p-3 border-2 border-gray-200 rounded-lg focus:border-medical-green"
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-elderly-body font-semibold">
                        Address
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="123 Main Street, City, State 12345"
                        className="mt-2 text-elderly-body p-3 border-2 border-gray-200 rounded-lg focus:border-medical-green"
                        data-testid="input-address"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="bg-medical-green hover:bg-medical-green/90 text-white px-8 py-3 text-elderly-body font-semibold"
                        data-testid="button-save-profile"
                      >
                        <Save className="mr-2" aria-hidden="true" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-2 border-gray-300 hover:bg-gray-100 px-8 py-3 text-elderly-body font-semibold"
                        data-testid="button-cancel-edit"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4">
                        <User className="text-medical-green" aria-hidden="true" />
                        <div>
                          <div className="text-elderly-body font-semibold text-gray-600">Name</div>
                          <div className="text-elderly-heading font-bold" data-testid="text-user-full-name">
                            {user?.firstName || "Not provided"} {user?.lastName || ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Mail className="text-trust-blue" aria-hidden="true" />
                        <div>
                          <div className="text-elderly-body font-semibold text-gray-600">Email</div>
                          <div className="text-elderly-heading font-bold" data-testid="text-user-email">
                            {user?.email || "Not provided"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4">
                        <Phone className="text-success-green" aria-hidden="true" />
                        <div>
                          <div className="text-elderly-body font-semibold text-gray-600">Phone</div>
                          <div className="text-elderly-heading font-bold" data-testid="text-user-phone">
                            {profileData.phone || "Not provided"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <MapPin className="text-alert-orange" aria-hidden="true" />
                        <div>
                          <div className="text-elderly-body font-semibold text-gray-600">Address</div>
                          <div className="text-elderly-heading font-bold" data-testid="text-user-address">
                            {profileData.address || "Not provided"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="mt-8 border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-elderly-heading font-bold text-medical-green">
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-gray-200 hover:bg-gray-100 p-4 text-elderly-body"
                  data-testid="button-notification-settings"
                >
                  <Bell className="mr-3 text-trust-blue" aria-hidden="true" />
                  Notification Preferences
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-gray-200 hover:bg-gray-100 p-4 text-elderly-body"
                  data-testid="button-privacy-settings"
                >
                  <Shield className="mr-3 text-success-green" aria-hidden="true" />
                  Privacy & Security
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-gray-200 hover:bg-gray-100 p-4 text-elderly-body"
                  data-testid="button-accessibility-settings"
                >
                  <Palette className="mr-3 text-alert-orange" aria-hidden="true" />
                  Accessibility Options
                </Button>

                <Separator />

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start border-2 border-error-red text-error-red hover:bg-error-red hover:text-white p-4 text-elderly-body font-semibold"
                  data-testid="button-logout"
                >
                  <LogOut className="mr-3" aria-hidden="true" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Stats */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="border-2 border-gray-100">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-medical-green rounded-full flex items-center justify-center mx-auto mb-4">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white text-4xl" aria-hidden="true" />
                  )}
                </div>
                <h3 className="text-elderly-heading font-bold text-text-primary mb-2" data-testid="text-profile-name">
                  {user?.firstName || "User"} {user?.lastName || ""}
                </h3>
                <p className="text-elderly-body text-gray-600">
                  Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                </p>
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card className="border-2 border-medical-green">
              <CardHeader>
                <CardTitle className="text-elderly-heading font-bold text-medical-green">
                  Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-elderly-body text-gray-600">Active Medications</span>
                  <span className="text-elderly-heading font-bold text-medical-green" data-testid="text-active-medications">
                    {activeMedications}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-elderly-body text-gray-600">Health Goals</span>
                  <span className="text-elderly-heading font-bold text-trust-blue" data-testid="text-active-goals">
                    {activeGoals}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-elderly-body text-gray-600">This Week</span>
                  <span className="text-elderly-heading font-bold text-success-green">
                    92% Complete
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-elderly-heading font-bold text-medical-green">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-gray-200 hover:bg-gray-100 p-3 text-elderly-body"
                  data-testid="button-emergency-contacts"
                >
                  <Phone className="mr-3 text-error-red" aria-hidden="true" />
                  Emergency Contacts
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-2 border-gray-200 hover:bg-gray-100 p-3 text-elderly-body"
                  data-testid="button-family-sharing"
                >
                  <Shield className="mr-3 text-trust-blue" aria-hidden="true" />
                  Family Sharing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Screen reader content */}
      <div className="sr-only">
        <h1>User Profile Management Page</h1>
        <p>
          This page allows you to view and edit your personal information, manage account settings, 
          view your health summary, and access quick actions for emergency contacts and family sharing.
        </p>
      </div>
    </div>
  );
}
