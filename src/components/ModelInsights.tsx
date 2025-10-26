import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Shield } from "lucide-react";

export const ModelInsights = () => {
  const insights = [
    {
      label: "Model Confidence",
      value: 85,
      icon: Brain,
      description: "Overall prediction confidence",
    },
    {
      label: "Data Quality",
      value: 98,
      icon: Shield,
      description: "Input data completeness",
    },
    {
      label: "Accuracy Score",
      value: 85,
      icon: TrendingUp,
      description: "Historical model accuracy",
    },
  ];

  return (
    <Card className="shadow-medical border-border/50 sticky top-6">
      <CardHeader className="bg-gradient-medical">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="h-5 w-5" />
          Model Insights
        </CardTitle>
        <CardDescription>AI analysis metrics and confidence scores</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {insights.map((insight) => (
          <div key={insight.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <insight.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{insight.label}</span>
              </div>
              <span className="text-sm font-bold text-primary">{insight.value}%</span>
            </div>
            <Progress value={insight.value} className="h-2" />
            <p className="text-xs text-muted-foreground">{insight.description}</p>
          </div>
        ))}

        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-semibold">Model Information</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Algorithm:</span> XGBoost
            </p>
            <p>
              <span className="font-medium text-foreground">Accuracy:</span> 85%
            </p>
            <p>
              <span className="font-medium text-foreground">Training Data:</span> Metabric Dataset
            </p>
            <p>
              <span className="font-medium text-foreground">Last Updated:</span> January 2025
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
