import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Activity } from "lucide-react";

export interface PredictionResults {
  chemotherapy: string;
  radio_therapy: string;
  hormone_therapy: string;
}

interface ResultsDisplayProps {
  results: PredictionResults;
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const treatments = [
    {
      name: "Chemotherapy",
      value: results.chemotherapy,
      icon: Activity,
      description: "Systemic drug treatment to destroy cancer cells",
    },
    {
      name: "Radio Therapy",
      value: results.radio_therapy,
      icon: Activity,
      description: "High-energy radiation to kill cancer cells",
    },
    {
      name: "Hormone Therapy",
      value: results.hormone_therapy,
      icon: Activity,
      description: "Treatment to block hormones that fuel cancer growth",
    },
  ];

  const getStatusColor = (value: string) => {
    return value.toLowerCase() === "yes" ? "success" : "destructive";
  };

  const getStatusIcon = (value: string) => {
    return value.toLowerCase() === "yes" ? CheckCircle2 : XCircle;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="shadow-medical border-border/50">
        <CardHeader className="bg-gradient-medical">
          <CardTitle className="text-primary">Treatment Recommendations</CardTitle>
          <CardDescription>AI-powered analysis results</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {treatments.map((treatment, index) => {
              const StatusIcon = getStatusIcon(treatment.value);
              const statusColor = getStatusColor(treatment.value);
              const isRecommended = treatment.value.toLowerCase() === "yes";

              return (
                <motion.div
                  key={treatment.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card
                    className={`relative overflow-hidden border-2 transition-all hover:shadow-lg ${
                      isRecommended
                        ? "border-success/30 bg-success/5"
                        : "border-destructive/30 bg-destructive/5"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <treatment.icon className="h-5 w-5 text-muted-foreground" />
                        <Badge
                          variant={isRecommended ? "default" : "secondary"}
                          className={
                            isRecommended
                              ? "bg-success text-success-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {isRecommended ? "Recommended" : "Not Recommended"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{treatment.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{treatment.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
