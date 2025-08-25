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
import { Badge } from "@/components/ui/badge";
import { 
  PillBottle, 
  Plus, 
  Clock, 
  AlertCircle,
  Check,
  X,
  Calendar
} from "lucide-react";
import type { Medication } from "@shared/schema";

export default function Medications() {
  const { isAuthenticated, isLoading } = useAuth();
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

  // Fetch medications
  const { data: medications = [], isLoading: medicationsLoading, error } = useQuery<Medication[]>({
    queryKey: ["/api/medications"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  // Mark medication as taken
  const takeMedicationMutation = useMutation({
    mutationFn: async ({ medicationId }: { medicationId: string }) => {
      await apiRequest("POST", "/api/medication-logs", {
        medicationId,
        scheduledDate: new Date().toISOString(),
        takenAt: new Date().toISOString(),
        status: "taken",
      });
    },
    onSuccess: () => {
      toast({
        title: "Medication Logged",
        description: "Your medication has been marked as taken.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/medication-logs"] });
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
        description: "Failed to log medication. Please try again.",
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

  const handleTakeMedication = (medicationId: string) => {
    takeMedicationMutation.mutate({ medicationId });
  };

  const handleAddMedication = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Adding new medications will be available soon.",
    });
  };

  const getMedicationStatus = (medication: Medication) => {
    // Mock logic for demonstration
    const hour = new Date().getHours();
    if (hour < 9) return "upcoming";
    if (hour < 18) return "due";
    return "taken";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "due":
        return "bg-warning-orange text-white";
      case "overdue":
        return "bg-error-red text-white";
      case "taken":
        return "bg-success-green text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "due":
        return <Clock className="w-4 h-4" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      case "taken":
        return <Check className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-soft-white pb-24 md:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8" role="main">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-elderly-title font-bold text-medical-green mb-2 flex items-center">
              <PillBottle className="mr-3 text-2xl" aria-hidden="true" />
              My Medications
            </h2>
            <p className="text-elderly-body text-gray-600">
              Manage your daily medications and track your progress
            </p>
          </div>
          <Button
            onClick={handleAddMedication}
            className="bg-medical-green hover:bg-medical-green/90 text-white px-6 py-3 text-elderly-body font-semibold"
            data-testid="button-add-medication"
          >
            <Plus className="mr-2" aria-hidden="true" />
            Add Medication
          </Button>
        </div>

        {/* Medications List */}
        {medicationsLoading ? (
          <div className="text-center py-12">
            <div className="text-elderly-heading text-gray-600">Loading medications...</div>
          </div>
        ) : medications.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <PillBottle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-elderly-heading font-bold text-gray-600 mb-2">No Medications Added</h3>
              <p className="text-elderly-body text-gray-500 mb-6">
                Start by adding your first medication to get personalized reminders
              </p>
              <Button
                onClick={handleAddMedication}
                className="bg-medical-green hover:bg-medical-green/90 text-white px-8 py-4 text-elderly-body font-semibold"
                data-testid="button-add-first-medication"
              >
                <Plus className="mr-2" aria-hidden="true" />
                Add Your First Medication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {medications.map((medication: Medication) => {
              const status = getMedicationStatus(medication);
              return (
                <Card key={medication.id} className="border-2 border-gray-100 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-elderly-heading font-bold text-text-primary mb-2">
                          {medication.name}
                        </CardTitle>
                        <p className="text-elderly-body text-gray-600 mb-2">
                          {medication.dosage} • {medication.frequency.replace("_", " ")}
                        </p>
                        {medication.instructions && (
                          <p className="text-elderly-body text-gray-500">
                            {medication.instructions}
                          </p>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(status)} px-3 py-1 text-sm font-semibold`}>
                        {getStatusIcon(status)}
                        <span className="ml-1 capitalize">{status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-elderly-body text-gray-600">
                        <span>
                          <Calendar className="inline w-4 h-4 mr-1" />
                          Started: {new Date(medication.startDate).toLocaleDateString()}
                        </span>
                        {medication.endDate && (
                          <span>
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Ends: {new Date(medication.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        {status === "due" || status === "overdue" ? (
                          <>
                            <Button
                              onClick={() => handleTakeMedication(medication.id)}
                              disabled={takeMedicationMutation.isPending}
                              className="bg-success-green hover:bg-success-green/90 text-white px-6 py-2 text-elderly-body font-semibold"
                              data-testid={`button-take-medication-${medication.id}`}
                            >
                              <Check className="mr-2 w-4 h-4" aria-hidden="true" />
                              {takeMedicationMutation.isPending ? "Logging..." : "Mark as Taken"}
                            </Button>
                            <Button
                              variant="outline"
                              className="border-2 border-gray-300 hover:bg-gray-100 px-6 py-2 text-elderly-body font-semibold"
                              data-testid={`button-snooze-medication-${medication.id}`}
                            >
                              <Clock className="mr-2 w-4 h-4" aria-hidden="true" />
                              Snooze
                            </Button>
                          </>
                        ) : status === "taken" ? (
                          <Badge className="bg-success-green text-white px-4 py-2 text-elderly-body">
                            <Check className="mr-2 w-4 h-4" />
                            Taken Today
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-200 text-gray-700 px-4 py-2 text-elderly-body">
                            <Clock className="mr-2 w-4 h-4" />
                            Scheduled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Today's Summary */}
        {medications.length > 0 && (
          <Card className="mt-8 border-2 border-medical-green">
            <CardHeader>
              <CardTitle className="text-elderly-heading font-bold text-medical-green">
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-elderly-large font-bold text-success-green mb-2">
                    3
                  </div>
                  <p className="text-elderly-body text-gray-600">Medications Taken</p>
                </div>
                <div className="text-center">
                  <div className="text-elderly-large font-bold text-warning-orange mb-2">
                    1
                  </div>
                  <p className="text-elderly-body text-gray-600">Due Now</p>
                </div>
                <div className="text-center">
                  <div className="text-elderly-large font-bold text-gray-600 mb-2">
                    2
                  </div>
                  <p className="text-elderly-body text-gray-600">Scheduled Later</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />

      {/* Screen reader content */}
      <div className="sr-only">
        <h1>Medications Management Page</h1>
        <p>
          This page shows all your medications, their schedules, and allows you to track when you take them.
          Use the buttons to mark medications as taken or snooze reminders.
        </p>
      </div>
    </div>
  );
}
