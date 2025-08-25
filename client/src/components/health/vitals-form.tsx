import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  Activity,
  Weight,
  Thermometer,
  Save,
  X
} from "lucide-react";

interface VitalsFormProps {
  onSubmit: (data: VitalsFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<VitalsFormData>;
}

export interface VitalsFormData {
  type: string;
  value: string;
  unit: string;
  notes?: string;
}

const VITAL_TYPES = [
  {
    id: "blood_pressure",
    label: "Blood Pressure",
    icon: Heart,
    unit: "mmHg",
    placeholder: "120/80",
    color: "text-error-red"
  },
  {
    id: "heart_rate",
    label: "Heart Rate",
    icon: Activity,
    unit: "bpm",
    placeholder: "72",
    color: "text-trust-blue"
  },
  {
    id: "weight",
    label: "Weight",
    icon: Weight,
    unit: "lbs",
    placeholder: "150",
    color: "text-success-green"
  },
  {
    id: "temperature",
    label: "Temperature",
    icon: Thermometer,
    unit: "°F",
    placeholder: "98.6",
    color: "text-warning-orange"
  }
];

export default function VitalsForm({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialData = {}
}: VitalsFormProps) {
  const [formData, setFormData] = useState<VitalsFormData>({
    type: "blood_pressure",
    value: "",
    unit: "mmHg",
    notes: "",
    ...initialData
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedVitalType = VITAL_TYPES.find(type => type.id === formData.type);

  const handleTypeChange = (newType: string) => {
    const vitalType = VITAL_TYPES.find(type => type.id === newType);
    if (vitalType) {
      setFormData({
        ...formData,
        type: newType,
        unit: vitalType.unit,
        value: "" // Clear value when changing type
      });
      // Clear any existing errors
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.value.trim()) {
      newErrors.value = "Please enter a value for your vital sign.";
    } else if (formData.type === "blood_pressure") {
      // Validate blood pressure format (e.g., "120/80")
      const bpRegex = /^\d{2,3}\/\d{2,3}$/;
      if (!bpRegex.test(formData.value)) {
        newErrors.value = "Please enter blood pressure as systolic/diastolic (e.g., 120/80).";
      }
    } else if (formData.type === "heart_rate") {
      const heartRate = parseInt(formData.value);
      if (isNaN(heartRate) || heartRate < 30 || heartRate > 200) {
        newErrors.value = "Please enter a valid heart rate between 30 and 200 bpm.";
      }
    } else if (formData.type === "weight") {
      const weight = parseFloat(formData.value);
      if (isNaN(weight) || weight < 50 || weight > 1000) {
        newErrors.value = "Please enter a valid weight between 50 and 1000 lbs.";
      }
    } else if (formData.type === "temperature") {
      const temp = parseFloat(formData.value);
      if (isNaN(temp) || temp < 90 || temp > 110) {
        newErrors.value = "Please enter a valid temperature between 90 and 110°F.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const IconComponent = selectedVitalType?.icon || Heart;

  return (
    <Card className="border-2 border-medical-green">
      <CardHeader>
        <CardTitle className="text-elderly-heading font-bold text-medical-green flex items-center">
          <IconComponent className={`mr-3 text-2xl ${selectedVitalType?.color}`} aria-hidden="true" />
          Log Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vital Type Selection */}
          <div>
            <Label className="text-elderly-body font-semibold mb-4 block">
              Select Vital Sign Type
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VITAL_TYPES.map((vitalType) => {
                const VitalIcon = vitalType.icon;
                const isSelected = formData.type === vitalType.id;
                
                return (
                  <button
                    key={vitalType.id}
                    type="button"
                    onClick={() => handleTypeChange(vitalType.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected 
                        ? 'border-medical-green bg-medical-green bg-opacity-10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    data-testid={`button-vital-type-${vitalType.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <VitalIcon className={`text-2xl ${vitalType.color}`} aria-hidden="true" />
                      <div>
                        <div className="text-elderly-body font-semibold text-text-primary">
                          {vitalType.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          Measured in {vitalType.unit}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Value Input */}
          <div>
            <Label htmlFor="vital-value" className="text-elderly-body font-semibold">
              {selectedVitalType?.label} Reading
            </Label>
            <div className="flex mt-2">
              <Input
                id="vital-value"
                type="text"
                value={formData.value}
                onChange={(e) => {
                  setFormData({ ...formData, value: e.target.value });
                  // Clear error when user starts typing
                  if (errors.value) {
                    setErrors({ ...errors, value: "" });
                  }
                }}
                placeholder={selectedVitalType?.placeholder}
                className={`text-elderly-body p-4 border-2 rounded-l-lg focus:border-medical-green flex-1 ${
                  errors.value ? 'border-error-red' : 'border-gray-200'
                }`}
                data-testid="input-vital-value"
              />
              <div className="px-4 py-4 bg-gray-100 border-2 border-l-0 border-gray-200 rounded-r-lg text-elderly-body font-semibold">
                {formData.unit}
              </div>
            </div>
            {errors.value && (
              <p className="mt-2 text-elderly-body text-error-red" data-testid="error-vital-value">
                {errors.value}
              </p>
            )}
            
            {/* Helpful hints for each vital type */}
            <div className="mt-2 text-elderly-body text-gray-500">
              {formData.type === "blood_pressure" && (
                <p>Enter as systolic/diastolic (e.g., 120/80). Normal range is typically 90-120 / 60-80.</p>
              )}
              {formData.type === "heart_rate" && (
                <p>Normal resting heart rate is typically 60-100 beats per minute.</p>
              )}
              {formData.type === "weight" && (
                <p>Enter your current weight. Try to weigh yourself at the same time each day.</p>
              )}
              {formData.type === "temperature" && (
                <p>Normal body temperature is around 98.6°F (37°C). Range: 97-99°F.</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="vital-notes" className="text-elderly-body font-semibold">
              Notes (Optional)
            </Label>
            <Textarea
              id="vital-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information about this reading..."
              className="mt-2 text-elderly-body p-4 border-2 border-gray-200 rounded-lg focus:border-medical-green min-h-[100px]"
              data-testid="textarea-vital-notes"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-medical-green hover:bg-medical-green/90 text-white py-4 text-elderly-body font-semibold"
              data-testid="button-save-vital"
            >
              <Save className="mr-2 w-5 h-5" aria-hidden="true" />
              {isLoading ? "Saving..." : "Save Reading"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-2 border-gray-300 hover:bg-gray-100 py-4 text-elderly-body font-semibold"
              data-testid="button-cancel-vital"
            >
              <X className="mr-2 w-5 h-5" aria-hidden="true" />
              Cancel
            </Button>
          </div>
        </form>

        {/* Screen reader instructions */}
        <div className="sr-only">
          <p>
            This form allows you to log vital signs including blood pressure, heart rate, weight, and temperature.
            Select the type of vital sign, enter the measurement value, and optionally add notes.
            The form includes validation to ensure accurate readings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
