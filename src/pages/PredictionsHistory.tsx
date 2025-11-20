import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Image as ImageIcon, Stethoscope, User, Calendar, ChevronLeft, ChevronRight, Download, FileDown, FileText, TrendingUp, Clock } from "lucide-react";
import apiClient from "@/services/api";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

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

  const exportToCSV = (data: PredictionResult[]) => {
    const headers = [
      "ID",
      "Type",
      "Patient Name",
      "Patient Age",
      "Patient Gender",
      "Doctor Name",
      "Doctor Specialization",
      "Result",
      "Date",
      "Notes"
    ];

    const rows = data.map(pred => {
      let resultString = "";
      if (pred.prediction_type === "treatment") {
        resultString = Object.entries(pred.result)
          .map(([key, value]) => `${key}: ${value}`)
          .join("; ");
      } else if (pred.prediction_type === "survival") {
        resultString = `${pred.result.prediction} (${(pred.result.probability * 100).toFixed(1)}%)`;
      } else if (pred.prediction_type === "image") {
        resultString = `${pred.result.prediction} (${(pred.result.confidence * 100).toFixed(1)}% confidence)`;
      }

      return [
        pred.id,
        pred.prediction_type,
        pred.patient_details.name,
        pred.patient_details.age,
        pred.patient_details.gender,
        pred.doctor_details.name,
        pred.doctor_details.specialization,
        resultString,
        format(new Date(pred.created_at), "PPp"),
        pred.notes || ""
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `predictions_export_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `Downloaded ${data.length} predictions as CSV`,
    });
  };

  const exportToJSON = (data: PredictionResult[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `predictions_export_${format(new Date(), "yyyy-MM-dd_HH-mm")}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `Downloaded ${data.length} predictions as JSON`,
    });
  };

  const exportSinglePrediction = (prediction: PredictionResult) => {
    const report = {
      id: prediction.id,
      type: prediction.prediction_type,
      date: format(new Date(prediction.created_at), "PPpp"),
      patient: {
        name: prediction.patient_details.name,
        age: prediction.patient_details.age,
        gender: prediction.patient_details.gender,
      },
      doctor: {
        name: prediction.doctor_details.name,
        specialization: prediction.doctor_details.specialization,
      },
      result: prediction.result,
      input_data: prediction.input_data,
      notes: prediction.notes,
    };

    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `prediction_${prediction.id}_${prediction.prediction_type}_${format(new Date(), "yyyy-MM-dd")}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report Downloaded",
      description: `Downloaded prediction report for ${prediction.patient_details.name}`,
    });
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

  const filteredPredictions = activeTab === "all" 
    ? predictions 
    : predictions.filter(p => p.prediction_type === activeTab);

  const getStats = () => {
    const treatment = predictions.filter(p => p.prediction_type === "treatment").length;
    const survival = predictions.filter(p => p.prediction_type === "survival").length;
    const image = predictions.filter(p => p.prediction_type === "image").length;
    return { treatment, survival, image };
  };

  const stats = getStats();

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
        className="space-y-6"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              View and export AI predictions across the platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportToCSV(filteredPredictions)}
              disabled={filteredPredictions.length === 0}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => exportToJSON(filteredPredictions)}
              disabled={filteredPredictions.length === 0}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Treatment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.treatment}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Survival
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.survival}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.image}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="survival">Survival</TabsTrigger>
            <TabsTrigger value="image">Image Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {filteredPredictions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Clock className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-lg text-muted-foreground">No reports found</p>
                  <p className="text-sm text-muted-foreground/70">Reports will appear here once predictions are made</p>
                </CardContent>
              </Card>
            ) : (
              filteredPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {getPredictionIcon(prediction.prediction_type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-xl">
                                {getPredictionBadge(prediction.prediction_type)}
                              </CardTitle>
                              <Badge variant="outline" className="text-xs">
                                ID: {prediction.id}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(prediction.created_at), "PPp")}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportSinglePrediction(prediction)}
                          className="hover:bg-primary/10 hover:text-primary gap-2"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Patient Details */}
                        <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                          <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Patient Information
                          </h4>
                          <div className="space-y-2">
                            <p className="font-semibold text-lg">{prediction.patient_details.name}</p>
                            <div className="flex gap-3 text-sm text-muted-foreground">
                              <span className="px-2 py-1 rounded bg-background">{prediction.patient_details.gender}</span>
                              <span className="px-2 py-1 rounded bg-background">Age {prediction.patient_details.age}</span>
                            </div>
                          </div>
                        </div>

                        {/* Doctor Details */}
                        <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                          <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Consulting Doctor
                          </h4>
                          <div className="space-y-2">
                            <p className="font-semibold text-lg">{prediction.doctor_details.name}</p>
                            <p className="text-sm px-2 py-1 rounded bg-background text-muted-foreground">
                              {prediction.doctor_details.specialization}
                            </p>
                          </div>
                        </div>

                        {/* Results */}
                        <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                          <h4 className="font-semibold text-sm text-muted-foreground">
                            Prediction Results
                          </h4>
                          {renderResultSummary(prediction)}
                        </div>
                      </div>

                      {prediction.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="p-3 rounded-lg bg-muted/30">
                            <p className="text-sm">
                              <span className="font-semibold text-foreground">Clinical Notes:</span>
                              <span className="text-muted-foreground ml-2">{prediction.notes}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {(hasNext || hasPrevious) && filteredPredictions.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={!hasPrevious}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center px-6 py-2 rounded-lg bg-muted">
              <span className="text-sm font-medium">Page {currentPage}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!hasNext}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PredictionsHistory;
