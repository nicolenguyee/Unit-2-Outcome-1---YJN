import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/navigation/header";
import BottomNav from "@/components/navigation/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User, Medication, HealthMetric, HealthGoal, Appointment } from "@shared/schema";
import { 
  Heart, 
  PillBottle, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  MapPin,
  Check,
  TriangleAlert,
  Lightbulb,
  ChartLine,
  Footprints,
  Droplets,
  Bed
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  // Fetch dashboard data
  const { data: medications = [], isLoading: medicationsLoading } = useQuery<Medication[]>({
    queryKey: ["/api/medications"],
    enabled: isAuthenticated,
  });

  const { data: dailyTip } = useQuery<any>({
    queryKey: ["/api/health-tips/daily"],
    enabled: isAuthenticated,
  });

  const { data: upcomingAppointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments/upcoming"],
    enabled: isAuthenticated,
  });

  const { data: healthGoals = [] } = useQuery<HealthGoal[]>({
    queryKey: ["/api/health-goals"],
    enabled: isAuthenticated,
  });

  const { data: latestHeartRate } = useQuery<HealthMetric>({
    queryKey: ["/api/health-metrics/latest/heart_rate"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-elderly-heading">Loading...</div>
      </div>
    );
  }

  const firstName = (user as User)?.firstName || "User";
  const today = new Date().toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  // Calculate medication stats
  const todayMedications = medications.slice(0, 4); // Mock today's medications
  const completedMedications = 3; // Mock completed count
  
  // Mock urgent reminder
  const hasUrgentReminder = true;
  const urgentMedication = {
    name: "Blood Pressure Medication",
    dosage: "10mg",
    overdueMins: 30
  };

  return (
    <div className="min-h-screen bg-soft-white pb-24 md:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8" role="main">
        {/* Welcome Section */}
        <section className="mb-8" aria-labelledby="welcome-heading">
          <div className="bg-gradient-to-r from-medical-green to-trust-blue rounded-2xl p-8 text-white">
            <h2 id="welcome-heading" className="text-elderly-large font-bold mb-4">
              Good Morning, {firstName}!
            </h2>
            <p className="text-elderly-body mb-6">
              Here's your health summary for today, {today}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                <PillBottle className="text-4xl mb-3 mx-auto" aria-hidden="true" />
                <div className="text-elderly-heading font-bold" data-testid="text-medications-completed">
                  {completedMedications}
                </div>
                <div className="text-elderly-body">
                  of {todayMedications.length} medications taken
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                <Heart className="text-4xl mb-3 mx-auto" aria-hidden="true" />
                <div className="text-elderly-heading font-bold" data-testid="text-heart-rate">
                  {latestHeartRate?.value || "72"}
                </div>
                <div className="text-elderly-body">BPM heart rate</div>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                <Target className="text-4xl mb-3 mx-auto" aria-hidden="true" />
                <div className="text-elderly-heading font-bold" data-testid="text-goals-completed">
                  5
                </div>
                <div className="text-elderly-body">of 7 goals met</div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgent Reminders */}
        {hasUrgentReminder && (
          <section className="mb-8" aria-labelledby="urgent-reminders-heading">
            <div className="bg-warning-orange bg-opacity-10 border-2 border-warning-orange rounded-2xl p-6">
              <h3 id="urgent-reminders-heading" className="text-elderly-title font-bold text-warning-orange mb-4 flex items-center">
                <TriangleAlert className="mr-3 text-2xl" aria-hidden="true" />
                Important Reminder
              </h3>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-warning-orange rounded-xl flex items-center justify-center">
                        <PillBottle className="text-white text-2xl" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-elderly-heading font-bold" data-testid="text-urgent-medication-name">
                          {urgentMedication.name}
                        </h4>
                        <p className="text-elderly-body text-gray-600">
                          Take with food - {urgentMedication.dosage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-elderly-heading font-bold text-warning-orange">NOW</div>
                      <div className="text-elderly-body text-gray-600">
                        Overdue by {urgentMedication.overdueMins} min
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      className="flex-1 bg-success-green hover:bg-success-green/90 text-white py-4 px-6 text-elderly-body font-semibold"
                      data-testid="button-take-medication"
                    >
                      <Check className="mr-2" aria-hidden="true" />
                      I've Taken This
                    </Button>
                    <Button 
                      variant="secondary"
                      className="bg-gray-300 hover:bg-gray-400 text-text-primary py-4 px-6 text-elderly-body font-semibold"
                      data-testid="button-snooze-reminder"
                    >
                      <Clock className="mr-2" aria-hidden="true" />
                      Remind Me Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Today's Schedule */}
        <section className="mb-8" aria-labelledby="schedule-heading">
          <h3 id="schedule-heading" className="text-elderly-title font-bold text-medical-green mb-6 flex items-center">
            <Calendar className="mr-3 text-2xl" aria-hidden="true" />
            Today's Schedule
          </h3>
          
          <div className="grid gap-6">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment: any) => (
                <Card key={appointment.id} className="border-2 border-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-trust-blue rounded-xl flex items-center justify-center">
                        <Calendar className="text-white text-2xl" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-elderly-heading font-bold mb-2" data-testid={`text-appointment-title-${appointment.id}`}>
                          {appointment.title}
                        </h4>
                        <p className="text-elderly-body text-gray-600 mb-2">
                          {appointment.doctorName} - {appointment.description}
                        </p>
                        <div className="flex items-center space-x-4 text-elderly-body">
                          <span className="text-trust-blue font-semibold">
                            <Clock className="inline mr-1" aria-hidden="true" />
                            {new Date(appointment.appointmentDate).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </span>
                          <span className="text-gray-600">
                            <MapPin className="inline mr-1" aria-hidden="true" />
                            {appointment.location}
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="bg-medical-green hover:bg-medical-green/90 text-white py-3 px-6 text-elderly-body font-semibold"
                        data-testid={`button-view-appointment-details-${appointment.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-success-green rounded-xl flex items-center justify-center">
                      <PillBottle className="text-white text-2xl" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-elderly-heading font-bold mb-2">Evening Medications</h4>
                      <p className="text-elderly-body text-gray-600 mb-2">3 medications scheduled</p>
                      <div className="flex items-center space-x-4 text-elderly-body">
                        <span className="text-trust-blue font-semibold">
                          <Clock className="inline mr-1" aria-hidden="true" />
                          6:00 PM
                        </span>
                        <span className="text-success-green font-semibold">
                          <Check className="inline mr-1" aria-hidden="true" />
                          Reminder Set
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="secondary"
                      className="bg-gray-200 hover:bg-gray-300 text-text-primary py-3 px-6 text-elderly-body font-semibold"
                      data-testid="button-view-all-medications"
                    >
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8" aria-labelledby="quick-actions-heading">
          <h3 id="quick-actions-heading" className="text-elderly-title font-bold text-medical-green mb-6 flex items-center">
            <TrendingUp className="mr-3 text-2xl" aria-hidden="true" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button
              variant="outline"
              className="bg-white border-2 border-gray-100 hover:border-medical-green h-auto p-8 flex-col space-y-4"
              data-testid="button-log-vitals"
            >
              <div className="w-16 h-16 bg-medical-green rounded-xl flex items-center justify-center">
                <Heart className="text-white text-2xl" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-elderly-heading font-bold mb-2">Log Vitals</h4>
                <p className="text-elderly-body text-gray-600">Record blood pressure, heart rate</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="bg-white border-2 border-gray-100 hover:border-trust-blue h-auto p-8 flex-col space-y-4"
              data-testid="button-ask-question"
            >
              <div className="w-16 h-16 bg-trust-blue rounded-xl flex items-center justify-center">
                <Lightbulb className="text-white text-2xl" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-elderly-heading font-bold mb-2">Ask Health Question</h4>
                <p className="text-elderly-body text-gray-600">Get trusted health advice</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="bg-white border-2 border-gray-100 hover:border-alert-orange h-auto p-8 flex-col space-y-4"
              data-testid="button-view-history"
            >
              <div className="w-16 h-16 bg-alert-orange rounded-xl flex items-center justify-center">
                <ChartLine className="text-white text-2xl" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-elderly-heading font-bold mb-2">View History</h4>
                <p className="text-elderly-body text-gray-600">See past medications, vitals</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="bg-white border-2 border-gray-100 hover:border-success-green h-auto p-8 flex-col space-y-4"
              data-testid="button-set-goals"
            >
              <div className="w-16 h-16 bg-success-green rounded-xl flex items-center justify-center">
                <Target className="text-white text-2xl" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-elderly-heading font-bold mb-2">Health Goals</h4>
                <p className="text-elderly-body text-gray-600">Set and track progress</p>
              </div>
            </Button>
          </div>
        </section>

        {/* Health Tips */}
        {dailyTip && (
          <section className="mb-8" aria-labelledby="health-tips-heading">
            <h3 id="health-tips-heading" className="text-elderly-title font-bold text-medical-green mb-6 flex items-center">
              <Lightbulb className="mr-3 text-2xl" aria-hidden="true" />
              Daily Health Tips
            </h3>
            
            <Card className="border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  {(dailyTip as any)?.imageUrl && (
                    <img 
                      src={(dailyTip as any).imageUrl}
                      alt="Health tip illustration"
                      className="rounded-xl shadow-md w-48 h-32 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-elderly-heading font-bold mb-4" data-testid="text-daily-tip-title">
                      {(dailyTip as any).title}
                    </h4>
                    <p className="text-elderly-body text-gray-700 mb-4 leading-relaxed" data-testid="text-daily-tip-content">
                      {(dailyTip as any).content}
                    </p>
                    <div className="flex items-center text-elderly-body text-trust-blue">
                      <Heart className="mr-2" aria-hidden="true" />
                      <span className="font-semibold">
                        Verified by {(dailyTip as any).authorName}, {(dailyTip as any).authorCredentials}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Progress Tracking */}
        <section className="mb-8" aria-labelledby="progress-heading">
          <h3 id="progress-heading" className="text-elderly-title font-bold text-medical-green mb-6 flex items-center">
            <ChartLine className="mr-3 text-2xl" aria-hidden="true" />
            Your Progress This Week
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-100">
              <CardContent className="p-6">
                <h4 className="text-elderly-heading font-bold mb-4 text-center">Medication Adherence</h4>
                <div className="text-center mb-4">
                  <div className="text-elderly-large font-bold text-success-green" data-testid="text-weekly-adherence">
                    92%
                  </div>
                  <div className="text-elderly-body text-gray-600">This week</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-success-green h-4 rounded-full" style={{ width: "92%" }}></div>
                </div>
                <p className="text-elderly-body text-center text-gray-600">
                  Great job! You've taken <span className="font-semibold">23</span> of{" "}
                  <span className="font-semibold">25</span> scheduled medications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100">
              <CardContent className="p-6">
                <h4 className="text-elderly-heading font-bold mb-4 text-center">Health Goals</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Footprints className="text-success-green text-xl" aria-hidden="true" />
                      <span className="text-elderly-body">Daily Walk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-elderly-body font-semibold text-success-green" data-testid="text-daily-walk-progress">
                        6/7 days
                      </div>
                      <Check className="text-success-green" aria-hidden="true" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Droplets className="text-trust-blue text-xl" aria-hidden="true" />
                      <span className="text-elderly-body">Water Intake</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-elderly-body font-semibold text-success-green" data-testid="text-water-intake-progress">
                        5/7 days
                      </div>
                      <Check className="text-success-green" aria-hidden="true" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bed className="text-warning-orange text-xl" aria-hidden="true" />
                      <span className="text-elderly-body">Sleep 8 Hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-elderly-body font-semibold text-warning-orange" data-testid="text-sleep-progress">
                        3/7 days
                      </div>
                      <TriangleAlert className="text-warning-orange" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <BottomNav />

      {/* Screen reader content */}
      <div className="sr-only">
        <h1>Boomerang Healthcare Dashboard</h1>
        <p>
          This dashboard shows your daily health summary, medication reminders, upcoming appointments, 
          quick actions, daily health tips, and weekly progress tracking.
        </p>
      </div>
    </div>
  );
}
