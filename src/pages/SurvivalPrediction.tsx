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
      const response = await axios.post<SurvivalPrediction>(
        "http://localhost:8000/api/predict-survival/",
        formData
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
        >
          <Card className="shadow-medical border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Survival Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Prediction Status</p>
                  <p className="text-2xl font-bold">{prediction.prediction}</p>
                </div>
                <Badge 
                  variant={prediction.prediction === "Living" ? "default" : "destructive"}
                  className="text-lg px-4 py-2"
                >
                  {(prediction.probability * 100).toFixed(1)}% Probability
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Based on the clinical and genetic data provided, the model predicts the patient's survival status 
                  with {(prediction.probability * 100).toFixed(1)}% confidence.
                </p>
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
