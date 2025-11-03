import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

interface SurvivalPrediction {
  prediction: string;
  probability: number;
}

const SurvivalPrediction = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<SurvivalPrediction | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    
    try {
      // Transform form data to match Django serializer format
      const apiData = {
        age_at_diagnosis: parseFloat(formData.age) || 0,
        neoplasm_histologic_grade: parseFloat(formData.grade) || 0,
        her2_status: formData.her2 === "Positive" ? 1 : 0,
        er_status: formData.er === "Positive" ? 1 : 0,
        pr_status: formData.pr === "Positive" ? 1 : 0,
        tumor_size: parseFloat(formData.tumor_size) || 0,
        tumor_stage: parseFloat(formData.tumor_stage) || 0,
        lymph_nodes_examined_positive: parseFloat(formData.lymph_nodes) || 0,
        mutation_count: parseFloat(formData.mutation_count) || 0,
        nottingham_prognostic_index: parseFloat(formData.npi) || 0,
        inferred_menopausal_state: formData.menopausal === "Post" ? 1 : 0,
        overall_survival_months: parseFloat(formData.overall_survival) || 0,
        relapse_free_status_months: parseFloat(formData.relapse_free) || 0,
        tmb_nonsynonymous: parseFloat(formData.tmb) || 0,
        brca1: parseFloat(formData.BRCA1) || 0,
        brca2: parseFloat(formData.BRCA2) || 0,
        tp53: parseFloat(formData.TP53) || 0,
        erbb2: parseFloat(formData.ERBB2) || 0,
        esr1: parseFloat(formData.ESR1) || 0,
        pgr: parseFloat(formData.PGR) || 0,
        akt1: parseFloat(formData.AKT1) || 0,
        pik3ca: parseFloat(formData.PIK3CA) || 0,
        mki67: parseFloat(formData.MKI67) || 0,
        cdh1: parseFloat(formData.CDH1) || 0,
        bcl10: parseFloat(formData.BCL10) || 0,
        cfh: parseFloat(formData.CFH) || 0,
        rbm14: parseFloat(formData.RBM14) || 0,
        taok2: parseFloat(formData.TAOK2) || 0,
        dusp11: parseFloat(formData.DUSP11) || 0,
        iscu: parseFloat(formData.ISCU) || 0,
        marchf6: parseFloat(formData.MARCHF6) || 0,
        mob3b: parseFloat(formData.MOB3B) || 0,
        dnajb6: parseFloat(formData.DNAJB6) || 0,
        atg12: parseFloat(formData.ATG12) || 0,
      };

      const response = await axios.post<SurvivalPrediction>(
        API_ENDPOINTS.survival,
        apiData
      );
      
      setPrediction(response.data);
      toast({
        title: "Prediction Complete",
        description: `Patient predicted as ${response.data.prediction} with ${(response.data.probability * 100).toFixed(1)}% probability`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setPrediction(null);
    const form = document.querySelector('form') as HTMLFormElement;
    form?.reset();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Survival Prediction
        </h2>
        <p className="text-muted-foreground mt-2">
          Predict patient survival outcomes based on clinical and genetic data
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Clinical Predictors
            </CardTitle>
            <CardDescription>
              Enter patient clinical information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age at Diagnosis</Label>
                <Input 
                  id="age" 
                  type="number" 
                  placeholder="55"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="grade">Neoplasm Histologic Grade</Label>
                <Select onValueChange={(value) => handleInputChange('grade', value)} value={formData.grade}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="her2">HER2 Status</Label>
                <Select onValueChange={(value) => handleInputChange('her2', value)} value={formData.her2}>
                  <SelectTrigger id="her2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="er">ER Status</Label>
                <Select onValueChange={(value) => handleInputChange('er', value)} value={formData.er}>
                  <SelectTrigger id="er">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pr">PR Status</Label>
                <Select onValueChange={(value) => handleInputChange('pr', value)} value={formData.pr}>
                  <SelectTrigger id="pr">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tumor_size">Tumor Size (mm)</Label>
                <Input 
                  id="tumor_size" 
                  type="number" 
                  placeholder="30"
                  value={formData.tumor_size || ''}
                  onChange={(e) => handleInputChange('tumor_size', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tumor_stage">Tumor Stage</Label>
                <Select onValueChange={(value) => handleInputChange('tumor_stage', value)} value={formData.tumor_stage}>
                  <SelectTrigger id="tumor_stage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Stage 1</SelectItem>
                    <SelectItem value="2">Stage 2</SelectItem>
                    <SelectItem value="3">Stage 3</SelectItem>
                    <SelectItem value="4">Stage 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lymph_nodes">Lymph Nodes Examined Positive</Label>
                <Input 
                  id="lymph_nodes" 
                  type="number" 
                  placeholder="1"
                  value={formData.lymph_nodes || ''}
                  onChange={(e) => handleInputChange('lymph_nodes', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mutation_count">Mutation Count</Label>
                <Input 
                  id="mutation_count" 
                  type="number" 
                  placeholder="5"
                  value={formData.mutation_count || ''}
                  onChange={(e) => handleInputChange('mutation_count', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="npi">Nottingham Prognostic Index</Label>
                <Input 
                  id="npi" 
                  type="number" 
                  step="0.1" 
                  placeholder="4.5"
                  value={formData.npi || ''}
                  onChange={(e) => handleInputChange('npi', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="menopausal">Inferred Menopausal State</Label>
                <Select onValueChange={(value) => handleInputChange('menopausal', value)} value={formData.menopausal}>
                  <SelectTrigger id="menopausal">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre">Pre</SelectItem>
                    <SelectItem value="Post">Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tmb">TMB (nonsynonymous)</Label>
                <Input 
                  id="tmb" 
                  type="number" 
                  step="0.1" 
                  placeholder="2.5"
                  value={formData.tmb || ''}
                  onChange={(e) => handleInputChange('tmb', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="overall_survival">Overall Survival (Months)</Label>
                <Input 
                  id="overall_survival" 
                  type="number" 
                  step="0.1" 
                  placeholder="60"
                  value={formData.overall_survival || ''}
                  onChange={(e) => handleInputChange('overall_survival', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="relapse_free">Relapse Free Status (Months)</Label>
                <Input 
                  id="relapse_free" 
                  type="number" 
                  step="0.1" 
                  placeholder="50"
                  value={formData.relapse_free || ''}
                  onChange={(e) => handleInputChange('relapse_free', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medical mt-6">
          <CardHeader>
            <CardTitle>Genetic Markers</CardTitle>
            <CardDescription>
              Enter genetic marker expression values (0-1)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['BRCA1', 'BRCA2', 'TP53', 'ERBB2', 'ESR1', 'PGR', 'AKT1', 'PIK3CA', 'MKI67', 'CDH1', 
                'BCL10', 'CFH', 'RBM14', 'TAOK2', 'DUSP11', 'ISCU', 'MARCHF6', 'MOB3B', 'DNAJB6', 'ATG12'].map((gene) => (
                <div key={gene}>
                  <Label htmlFor={gene}>{gene}</Label>
                  <Input
                    id={gene}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.5"
                    value={formData[gene] || ''}
                    onChange={(e) => handleInputChange(gene, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Predicting..." : "Predict Survival"}
          </Button>
        </div>
      </form>

      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="shadow-medical border-primary/20 bg-gradient-to-br from-background to-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Heart className="h-7 w-7 text-primary" />
                Survival Prediction Results
              </CardTitle>
              <CardDescription>
                AI-powered survival analysis based on clinical and genetic data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-lg border-2 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Prediction Status
                      </p>
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${prediction.prediction === "Living" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                        <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                          {prediction.prediction}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Confidence Level
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold">{(prediction.probability * 100).toFixed(1)}%</p>
                        <Badge 
                          variant={prediction.prediction === "Living" ? "default" : "destructive"}
                          className="text-base px-4 py-2"
                        >
                          {prediction.probability >= 0.8 ? "High" : prediction.probability >= 0.6 ? "Moderate" : "Low"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Clinical Interpretation
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Based on the comprehensive analysis of <strong>{Object.keys(formData).length} clinical and genetic parameters</strong>, 
                      the Random Forest machine learning model predicts the patient's survival status as{" "}
                      <strong className={prediction.prediction === "Living" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {prediction.prediction}
                      </strong>{" "}
                      with a confidence level of <strong>{(prediction.probability * 100).toFixed(1)}%</strong>.
                    </p>
                    {prediction.probability >= 0.85 && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <Badge variant="default" className="mt-0.5">High Confidence</Badge>
                        <p className="text-sm">
                          This prediction shows high reliability based on the trained model's performance on the Metabric dataset.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-secondary/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Model</p>
                  <p className="text-lg font-bold">Random Forest</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Dataset</p>
                  <p className="text-lg font-bold">Metabric</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border">
                  <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-lg font-bold">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="shadow-medical border-primary/20">
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            This tool predicts patient survival outcomes using advanced machine learning algorithms trained on comprehensive clinical and genetic data.
          </p>
          <p>
            <strong>Note:</strong> Predictions are based on statistical models and should be used alongside clinical judgment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurvivalPrediction;
