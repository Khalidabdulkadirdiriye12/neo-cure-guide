import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Image, Stethoscope, Calendar, User, UserCircle } from "lucide-react";
import { format } from "date-fns";

interface Prediction {
  id: number;
  prediction_type: string;
  result: any;
  created_at: string;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
  };
  doctor: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

const fetchPredictions = async (): Promise<Prediction[]> => {
  const response = await apiClient.get("/predictions/");
  return response.data;
};

const getPredictionIcon = (type: string) => {
  switch (type) {
    case "treatment":
      return <Stethoscope className="h-5 w-5" />;
    case "survival":
      return <Activity className="h-5 w-5" />;
    case "image":
      return <Image className="h-5 w-5" />;
    default:
      return <Activity className="h-5 w-5" />;
  }
};

const getPredictionBadgeVariant = (type: string) => {
  switch (type) {
    case "treatment":
      return "default";
    case "survival":
      return "secondary";
    case "image":
      return "outline";
    default:
      return "default";
  }
};

export default function Predictions() {
  const { data: predictions, isLoading, error } = useQuery({
    queryKey: ["predictions"],
    queryFn: fetchPredictions,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Predictions</CardTitle>
            <CardDescription>
              Failed to load predictions. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Predictions</h1>
        <p className="text-muted-foreground">
          View all predictions made across treatment, survival, and image analysis
        </p>
      </div>

      {predictions && predictions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Predictions Yet</CardTitle>
            <CardDescription>
              Predictions will appear here once you start using the AI tools.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {predictions?.map((prediction) => (
            <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPredictionIcon(prediction.prediction_type)}
                    <Badge variant={getPredictionBadgeVariant(prediction.prediction_type)}>
                      {prediction.prediction_type}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    #{prediction.id}
                  </span>
                </div>
                <CardTitle className="text-lg">
                  {prediction.prediction_type.charAt(0).toUpperCase() + 
                   prediction.prediction_type.slice(1)} Prediction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-medium">
                    {prediction.patient.first_name} {prediction.patient.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">
                    {prediction.doctor.first_name} {prediction.doctor.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {format(new Date(prediction.created_at), "MMM dd, yyyy")}
                  </span>
                </div>
                
                {prediction.result && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Result:</p>
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {typeof prediction.result === 'string' 
                        ? prediction.result 
                        : JSON.stringify(prediction.result, null, 2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
