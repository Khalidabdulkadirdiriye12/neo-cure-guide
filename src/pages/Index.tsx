import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";
import { PatientForm, PatientData } from "@/components/PatientForm";
import { ResultsDisplay, PredictionResults } from "@/components/ResultsDisplay";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { ModelInsights } from "@/components/ModelInsights";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResults | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: PatientData) => {
    setIsLoading(true);
    setResults(null);

    try {
      // Transform data to API format
      const apiData = {
        "Age at Diagnosis": data.age_at_diagnosis,
        "Neoplasm Histologic Grade": data.neoplasm_histologic_grade,
        "HER2 Status": data.her2_status,
        "ER Status": data.er_status,
        "PR Status": data.pr_status,
        "Tumor Size": data.tumor_size,
        "Tumor Stage": data.tumor_stage,
        "Lymph nodes examined positive": data.lymph_nodes_examined_positive,
        "Mutation Count": data.mutation_count,
        "Nottingham prognostic index": data.nottingham_prognostic_index,
        "Inferred Menopausal State": data.inferred_menopausal_state,
        "BRCA1": data.brca1,
        "BRCA2": data.brca2,
        "TP53": data.tp53,
        "ERBB2": data.erbb2,
        "ESR1": data.esr1,
        "PGR": data.pgr,
        "AKT1": data.akt1,
        "PIK3CA": data.pik3ca,
        "MKI67": data.mki67,
        "CDH1": data.cdh1,
      };

      const response = await axios.post<PredictionResults>(
        "http://localhost:8000/predict/",
        apiData,
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
    <div className="min-h-screen bg-gradient-medical">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AI Treatment Recommender
                </h1>
                <p className="text-sm text-muted-foreground">Cancer Treatment Decision Support</p>
              </div>
            </motion.div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <motion.p
            className="text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Powered by <span className="font-semibold text-primary">Som Innovation AI Engine</span>
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
