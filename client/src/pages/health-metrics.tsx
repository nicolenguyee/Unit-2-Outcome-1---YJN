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
import { 
  Heart, 
  Plus,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";
import type { HealthMetric } from "@shared/schema";

export default function HealthMetrics() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "blood_pressure",
    value: "",
    unit: "mmHg",
    notes: "",
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

  // Fetch health metrics
  const { data: metrics = [], isLoading: metricsLoading, error } = useQuery({
    queryKey: ["/api/health-metrics"],
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

  // Add health metric mutation
  const addMetricMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/health-metrics", {
        ...data,
        recordedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Health Metric Added",
        description: "Your health metric has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics"] });
      setShowAddForm(false);
      setFormData({
        type: "blood_pressure",
        value: "",
        unit: "mmHg",
        notes: "",
      });
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
        description: "Failed to add health metric. Please try again.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a value for your health metric.",
        variant: "destructive",
      });
      return;
    }
    addMetricMutation.mutate(formData);
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case "blood_pressure":
        return <Heart className="w-6 h-6" />;
      case "heart_rate":
        return <Activity className="w-6 h-6" />;
      default:
        return <TrendingUp className="w-6 h-6" />;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case "blood_pressure":
        return "text-error-red";
      case "heart_rate":
        return "text-trust-blue";
      case "weight":
        return "text-success-green";
      case "temperature":
        return "text-warning-orange";
      default:
        return "text-gray-600";
    }
  };

  const formatMetricType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  // Group metrics by type for better display
  const groupedMetrics = metrics.reduce((acc: any, metric: HealthMetric) => {
    if (!acc[metric.type]) {
      acc[metric.type] = [];
    }
    acc[metric.type].push(metric);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-soft-white pb-24 md:pb-0">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8" role="main">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-elderly-title font-bold text-medical-green mb-2 flex items-center">
              <Heart className="mr-3 text-2xl" aria-hidden="true" />
              Health Metrics
            </h2>
            <p className="text-elderly-body text-gray-600">
              Track your vital signs and monitor your health progress
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-medical-green hover:bg-medical-green/90 text-white px-6 py-3 text-elderly-body font-semibold"
            data-testid="button-add-metric"
          >
            <Plus className="mr-2" aria-hidden="true" />
            Log Vitals
          </Button>
        </div>

        {/* Add Metric Form */}
        {showAddForm && (
          <Card className="mb-8 border-2 border-medical-green">
            <CardHeader>
              <CardTitle className="text-elderly-heading font-bold text-medical-green">
                Add Health Metric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="type" className="text-elderly-body font-semibold">
                      Metric Type
                    </Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        let newUnit = "";
                        switch (newType) {
                          case "blood_pressure":
                            newUnit = "mmHg";
                            break;
                          case "heart_rate":
                            newUnit = "bpm";
                            break;
                          case "weight":
                            newUnit = "lbs";
                            break;
                          case "temperature":
                            newUnit = "°F";
                            break;
                          default:
                            newUnit = "";
                        }
                        setFormData({ ...formData, type: newType, unit: newUnit });
                      }}
                      className="w-full mt-2 p-3 border-2 border-gray-200 rounded-lg text-elderly-body focus:border-medical-green focus:outline-none"
                      data-testid="select-metric-type"
                    >
                      <option value="blood_pressure">Blood Pressure</option>
                      <option value="heart_rate">Heart Rate</option>
                      <option value="weight">Weight</option>
                      <option value="temperature">Temperature</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="value" className="text-elderly-body font-semibold">
                      Value
                    </Label>
                    <div className="flex mt-2">
                      <Input
                        id="value"
                        type="text"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder={formData.type === "blood_pressure" ? "120/80" : "Enter value"}
                        className="text-elderly-body p-3 border-2 border-gray-200 rounded-l-lg focus:border-medical-green"
                        data-testid="input-metric-value"
                      />
                      <div className="px-4 py-3 bg-gray-100 border-2 border-l-0 border-gray-200 rounded-r-lg text-elderly-body font-semibold">
                        {formData.unit}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-elderly-body font-semibold">
                    Notes (Optional)
                  </Label>
                  <Input
                    id="notes"
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    className="mt-2 text-elderly-body p-3 border-2 border-gray-200 rounded-lg focus:border-medical-green"
                    data-testid="input-metric-notes"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    disabled={addMetricMutation.isPending}
                    className="bg-medical-green hover:bg-medical-green/90 text-white px-8 py-3 text-elderly-body font-semibold"
                    data-testid="button-save-metric"
                  >
                    {addMetricMutation.isPending ? "Saving..." : "Save Metric"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-2 border-gray-300 hover:bg-gray-100 px-8 py-3 text-elderly-body font-semibold"
                    data-testid="button-cancel-metric"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Metrics Display */}
        {metricsLoading ? (
          <div className="text-center py-12">
            <div className="text-elderly-heading text-gray-600">Loading health metrics...</div>
          </div>
        ) : Object.keys(groupedMetrics).length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-elderly-heading font-bold text-gray-600 mb-2">No Health Metrics Recorded</h3>
              <p className="text-elderly-body text-gray-500 mb-6">
                Start tracking your health by adding your first vital signs reading
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-medical-green hover:bg-medical-green/90 text-white px-8 py-4 text-elderly-body font-semibold"
                data-testid="button-add-first-metric"
              >
                <Plus className="mr-2" aria-hidden="true" />
                Add Your First Reading
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedMetrics).map(([type, typeMetrics]: [string, any]) => (
              <Card key={type} className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className={`text-elderly-heading font-bold flex items-center ${getMetricColor(type)}`}>
                    {getMetricIcon(type)}
                    <span className="ml-3">{formatMetricType(type)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {typeMetrics.slice(0, 5).map((metric: HealthMetric) => (
                      <div 
                        key={metric.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="text-elderly-heading font-bold text-text-primary">
                            {metric.value} {metric.unit}
                          </div>
                          {metric.notes && (
                            <div className="text-elderly-body text-gray-600 mt-1">
                              {metric.notes}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-elderly-body text-gray-600">
                            {new Date(metric.recordedAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(metric.recordedAt).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit"
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {typeMetrics.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-2 border-gray-300 hover:bg-gray-100 py-3 text-elderly-body font-semibold"
                      data-testid={`button-view-all-${type}`}
                    >
                      View All {formatMetricType(type)} Readings ({typeMetrics.length})
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {Object.keys(groupedMetrics).length > 0 && (
          <Card className="mt-8 border-2 border-medical-green">
            <CardHeader>
              <CardTitle className="text-elderly-heading font-bold text-medical-green">
                Recent Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(groupedMetrics).map(([type, typeMetrics]: [string, any]) => {
                  const latest = typeMetrics[0];
                  return (
                    <div key={type} className="text-center">
                      <div className={`text-elderly-large font-bold mb-2 ${getMetricColor(type)}`}>
                        {latest.value}
                      </div>
                      <div className="text-elderly-body text-gray-600">
                        {formatMetricType(type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(latest.recordedAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />

      {/* Screen reader content */}
      <div className="sr-only">
        <h1>Health Metrics Tracking Page</h1>
        <p>
          This page allows you to log and track your vital signs including blood pressure, 
          heart rate, weight, and temperature. View your historical readings and monitor trends.
        </p>
      </div>
    </div>
  );
}
