import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PatientForm, PatientData } from "@/components/PatientForm";
import { ResultsDisplay, PredictionResults } from "@/components/ResultsDisplay";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { ModelInsights } from "@/components/ModelInsights";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResults | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: PatientData) => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await axios.post<PredictionResults>(
        "http://localhost:8000/predict/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
