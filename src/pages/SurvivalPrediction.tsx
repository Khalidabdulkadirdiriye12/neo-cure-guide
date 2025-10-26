import { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SurvivalPrediction = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Prediction Complete",
        description: "Backend integration pending.",
      });
    }, 2000);
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
                <Input id="age" type="number" placeholder="55" />
              </div>

              <div>
                <Label htmlFor="grade">Neoplasm Histologic Grade</Label>
                <Select>
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
                <Select>
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
                <Select>
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
                <Select>
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
                <Input id="tumor_size" type="number" placeholder="30" />
              </div>

              <div>
                <Label htmlFor="tumor_stage">Tumor Stage</Label>
                <Select>
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
                <Input id="lymph_nodes" type="number" placeholder="1" />
              </div>

              <div>
                <Label htmlFor="mutation_count">Mutation Count</Label>
                <Input id="mutation_count" type="number" placeholder="5" />
              </div>

              <div>
                <Label htmlFor="npi">Nottingham Prognostic Index</Label>
                <Input id="npi" type="number" step="0.1" placeholder="4.5" />
              </div>

              <div>
                <Label htmlFor="menopausal">Inferred Menopausal State</Label>
                <Select>
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
                <Input id="tmb" type="number" step="0.1" placeholder="2.5" />
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
              {['BRCA1', 'BRCA2', 'TP53', 'ERBB2', 'ESR1', 'PGR', 'AKT1', 'PIK3CA', 'MKI67', 'CDH1'].map((gene) => (
                <div key={gene}>
                  <Label htmlFor={gene}>{gene}</Label>
                  <Input
                    id={gene}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="0.5"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button type="button" variant="outline" className="flex-1">
            Reset
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Predicting..." : "Predict Survival"}
          </Button>
        </div>
      </form>

      <Card className="shadow-medical border-primary/20">
        <CardHeader>
          <CardTitle>About This Tool</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            This tool predicts patient survival outcomes using advanced machine learning algorithms.
          </p>
          <p>
            <strong>Note:</strong> Backend integration is pending. This is a frontend prototype.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurvivalPrediction;
