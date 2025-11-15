import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PatientForm, PatientData } from "@/components/PatientForm";
import { ResultsDisplay, PredictionResults } from "@/components/ResultsDisplay";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { ModelInsights } from "@/components/ModelInsights";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import apiClient, { formatPredictionData } from "@/services/api";

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  medical_record_number: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResults | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiClient.get('/api/patients/');
        setPatients(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to fetch patients. Please check your connection.",
          variant: "destructive",
        });
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (data: PatientData) => {
    if (!selectedPatientId) {
      toast({
        title: "Patient Required",
        description: "Please select a patient before making a prediction.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const predictionData = formatPredictionData({
        ...data,
        patient_id: selectedPatientId,
        doctor_id: user?.id,
        prediction_type: "treatment"
      });

      const response = await apiClient.post<PredictionResults>(
        '/api/predictor/predict/',
        predictionData
      );

      setResults(response.data);
      toast({
        title: "Analysis Complete",
        description: "Treatment recommendations generated successfully.",
      });
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast({
        title: "Error",
        description: "Failed to get predictions. Please ensure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient Selection
            </CardTitle>
            <CardDescription>
              Select a patient for this prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="patient-select">Patient</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger id="patient-select">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.first_name} {patient.last_name} (MRN: {patient.medical_record_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-lg shadow-medical border"
          >
            <LoadingAnimation />
          </motion.div>
        )}

        {/* Results */}
        {results && !isLoading && <ResultsDisplay results={results} />}
      </div>

      {/* Insights Panel */}
      <div className="lg:col-span-1">
        <ModelInsights />
      </div>
    </div>
  );
};

export default Index;
