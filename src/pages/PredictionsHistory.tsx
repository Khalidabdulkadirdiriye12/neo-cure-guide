import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Image as ImageIcon, Stethoscope, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import apiClient from "@/services/api";
import { format } from "date-fns";

interface PredictionResult {
  id: number;
  prediction_type: "treatment" | "survival" | "image";
  input_data: any;
  result: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient_details: {
    id: number;
    name: string;
    gender: string;
    age: number;
  };
  doctor_details: {
    id: number;
    name: string;
    specialization: string;
  };
}

interface PredictionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PredictionResult[];
}

const PredictionsHistory = () => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchPredictions = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await apiClient.get<PredictionsResponse>(
        `/api/predictions/predictions/?page=${page}`
      );
      setPredictions(response.data.results);
      setTotalCount(response.data.count);
      setHasNext(!!response.data.next);
      setHasPrevious(!!response.data.previous);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions(currentPage);
  }, [currentPage]);

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case "treatment":
        return <Stethoscope className="h-5 w-5" />;
      case "survival":
        return <Activity className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getPredictionBadge = (type: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      treatment: { variant: "default", label: "Treatment" },
      survival: { variant: "secondary", label: "Survival" },
      image: { variant: "outline", label: "Image Analysis" },
    };
    const config = variants[type] || variants.treatment;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderResultSummary = (prediction: PredictionResult) => {
    switch (prediction.prediction_type) {
      case "treatment":
        return (
          <div className="space-y-1">
            {Object.entries(prediction.result).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        );
      case "survival":
        return (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prediction:</span>
              <span className={`font-semibold ${prediction.result.prediction === "Living" ? "text-green-600" : "text-red-600"}`}>
                {prediction.result.prediction}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Probability:</span>
              <span className="font-medium">{(prediction.result.probability * 100).toFixed(1)}%</span>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Result:</span>
              <span className={`font-semibold ${prediction.result.prediction === "benign" ? "text-green-600" : "text-red-600"}`}>
                {prediction.result.prediction}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence:</span>
              <span className="font-medium">{(prediction.result.confidence * 100).toFixed(1)}%</span>
            </div>
            {prediction.input_data.filename && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">File:</span>
                <span className="font-medium text-xs truncate max-w-[200px]">{prediction.input_data.filename}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Predictions History
            </h1>
            <p className="text-muted-foreground mt-2">
              View all AI predictions made across the platform ({totalCount} total)
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {predictions.map((prediction) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getPredictionIcon(prediction.prediction_type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {getPredictionBadge(prediction.prediction_type)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(prediction.created_at), "PPp")}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Patient Details */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Patient Information
                      </h4>
                      <div className="space-y-1">
                        <p className="font-medium">{prediction.patient_details.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {prediction.patient_details.gender} • Age {prediction.patient_details.age}
                        </p>
                      </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Consulting Doctor
                      </h4>
                      <div className="space-y-1">
                        <p className="font-medium">{prediction.doctor_details.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {prediction.doctor_details.specialization}
                        </p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        Results
                      </h4>
                      {renderResultSummary(prediction)}
                    </div>
                  </div>

                  {prediction.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Notes:</span> {prediction.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {(hasNext || hasPrevious) && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm text-muted-foreground">
              Page {currentPage}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PredictionsHistory;
