import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PillBottle, 
  Clock, 
  AlertCircle,
  Check,
  Calendar,
  MoreVertical
} from "lucide-react";
import type { Medication } from "@shared/schema";

interface MedicationCardProps {
  medication: Medication;
  status?: "upcoming" | "due" | "overdue" | "taken";
  onTakeMedication?: (medicationId: string) => void;
  onSnoozeMedication?: (medicationId: string) => void;
  onViewDetails?: (medicationId: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

export default function MedicationCard({
  medication,
  status = "upcoming",
  onTakeMedication,
  onSnoozeMedication,
  onViewDetails,
  isLoading = false,
  showActions = true
}: MedicationCardProps) {
  
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
        return <Clock className="w-4 h-4" aria-hidden="true" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" aria-hidden="true" />;
      case "taken":
        return <Check className="w-4 h-4" aria-hidden="true" />;
      default:
        return <Calendar className="w-4 h-4" aria-hidden="true" />;
    }
  };

  const formatFrequency = (frequency: string) => {
    return frequency.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Card 
      className="border-2 border-gray-100 hover:shadow-md transition-shadow duration-200"
      data-testid={`medication-card-${medication.id}`}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-medical-green rounded-lg flex items-center justify-center flex-shrink-0">
              <PillBottle className="text-white text-xl" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle 
                className="text-elderly-heading font-bold text-text-primary mb-2 truncate"
                data-testid={`text-medication-name-${medication.id}`}
              >
                {medication.name}
              </CardTitle>
              <div className="space-y-1">
                <p className="text-elderly-body text-gray-600">
                  <span className="font-semibold">{medication.dosage}</span> • {formatFrequency(medication.frequency)}
                </p>
                {medication.instructions && (
                  <p 
                    className="text-elderly-body text-gray-500 line-clamp-2"
                    data-testid={`text-medication-instructions-${medication.id}`}
                  >
                    {medication.instructions}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              className={`${getStatusColor(status)} px-3 py-1 text-sm font-semibold flex items-center gap-1`}
              data-testid={`badge-medication-status-${medication.id}`}
            >
              {getStatusIcon(status)}
              <span className="capitalize">{status}</span>
            </Badge>
            
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(medication.id)}
                className="p-2"
                data-testid={`button-medication-menu-${medication.id}`}
              >
                <MoreVertical className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">More options for {medication.name}</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Medication Schedule Info */}
        <div className="flex items-center space-x-4 text-elderly-body text-gray-600 mb-4">
          <span className="flex items-center">
            <Calendar className="inline w-4 h-4 mr-1" aria-hidden="true" />
            Started: {formatDate(medication.startDate.toString())}
          </span>
          {medication.endDate && (
            <span className="flex items-center">
              <Calendar className="inline w-4 h-4 mr-1" aria-hidden="true" />
              Ends: {formatDate(medication.endDate.toString())}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-wrap gap-3">
            {(status === "due" || status === "overdue") && onTakeMedication && (
              <Button
                onClick={() => onTakeMedication(medication.id)}
                disabled={isLoading}
                className="bg-success-green hover:bg-success-green/90 text-white px-6 py-3 text-elderly-body font-semibold flex-1 sm:flex-none"
                data-testid={`button-take-medication-${medication.id}`}
              >
                <Check className="mr-2 w-4 h-4" aria-hidden="true" />
                {isLoading ? "Logging..." : "Mark as Taken"}
              </Button>
            )}
            
            {(status === "due" || status === "overdue") && onSnoozeMedication && (
              <Button
                onClick={() => onSnoozeMedication(medication.id)}
                variant="outline"
                className="border-2 border-gray-300 hover:bg-gray-100 px-6 py-3 text-elderly-body font-semibold flex-1 sm:flex-none"
                data-testid={`button-snooze-medication-${medication.id}`}
              >
                <Clock className="mr-2 w-4 h-4" aria-hidden="true" />
                Snooze
              </Button>
            )}
            
            {status === "taken" && (
              <Badge className="bg-success-green text-white px-4 py-3 text-elderly-body font-semibold">
                <Check className="mr-2 w-4 h-4" aria-hidden="true" />
                Taken Today
              </Badge>
            )}
            
            {status === "upcoming" && (
              <Badge className="bg-gray-200 text-gray-700 px-4 py-3 text-elderly-body font-semibold">
                <Clock className="mr-2 w-4 h-4" aria-hidden="true" />
                Scheduled
              </Badge>
            )}
          </div>
        )}

        {/* Accessibility helper */}
        <div className="sr-only">
          Medication: {medication.name}, 
          Dosage: {medication.dosage}, 
          Frequency: {formatFrequency(medication.frequency)}, 
          Status: {status},
          {medication.instructions && `Instructions: ${medication.instructions}`}
        </div>
      </CardContent>
    </Card>
  );
}
