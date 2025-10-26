import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

export interface PatientData {
  age_at_diagnosis: number;
  neoplasm_histologic_grade: number;
  her2_status: string;
  er_status: string;
  pr_status: string;
  tumor_size: number;
  tumor_stage: number;
  lymph_nodes_examined_positive: number;
  mutation_count: number;
  nottingham_prognostic_index: number;
  inferred_menopausal_state: string;
  brca1: number;
  brca2: number;
  tp53: number;
  erbb2: number;
  esr1: number;
  pgr: number;
  akt1: number;
  pik3ca: number;
  mki67: number;
  cdh1: number;
}

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const initialFormData: PatientData = {
  age_at_diagnosis: 50,
  neoplasm_histologic_grade: 2,
  her2_status: "Negative",
  er_status: "Positive",
  pr_status: "Positive",
  tumor_size: 20,
  tumor_stage: 2,
  lymph_nodes_examined_positive: 0,
  mutation_count: 5,
  nottingham_prognostic_index: 3.4,
  inferred_menopausal_state: "Post",
  brca1: 0,
  brca2: 0,
  tp53: 0,
  erbb2: 0,
  esr1: 1,
  pgr: 1,
  akt1: 0,
  pik3ca: 0,
  mki67: 0,
  cdh1: 0,
};

export const PatientForm = ({ onSubmit, isLoading }: PatientFormProps) => {
  const [formData, setFormData] = useState<PatientData>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const updateField = (field: keyof PatientData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Clinical Data Section */}
      <Card className="shadow-medical border-border/50">
        <CardHeader className="bg-gradient-medical">
          <CardTitle className="text-primary">Clinical Data</CardTitle>
          <CardDescription>Patient demographic and tumor characteristics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age at Diagnosis</Label>
              <Input
                id="age"
                type="number"
                value={formData.age_at_diagnosis}
                onChange={(e) => updateField("age_at_diagnosis", Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Neoplasm Histologic Grade</Label>
              <Input
                id="grade"
                type="number"
                min="1"
                max="3"
                value={formData.neoplasm_histologic_grade}
                onChange={(e) => updateField("neoplasm_histologic_grade", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="her2">HER2 Status</Label>
              <Select
                value={formData.her2_status}
                onValueChange={(value) => updateField("her2_status", value)}
              >
                <SelectTrigger id="her2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="er">ER Status</Label>
              <Select
                value={formData.er_status}
                onValueChange={(value) => updateField("er_status", value)}
              >
                <SelectTrigger id="er">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pr">PR Status</Label>
              <Select
                value={formData.pr_status}
                onValueChange={(value) => updateField("pr_status", value)}
              >
                <SelectTrigger id="pr">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="menopausal">Inferred Menopausal State</Label>
              <Select
                value={formData.inferred_menopausal_state}
                onValueChange={(value) => updateField("inferred_menopausal_state", value)}
              >
                <SelectTrigger id="menopausal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre">Pre</SelectItem>
                  <SelectItem value="Post">Post</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tumor_size">Tumor Size (mm)</Label>
              <Input
                id="tumor_size"
                type="number"
                value={formData.tumor_size}
                onChange={(e) => updateField("tumor_size", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tumor_stage">Tumor Stage</Label>
              <Input
                id="tumor_stage"
                type="number"
                min="0"
                max="4"
                value={formData.tumor_stage}
                onChange={(e) => updateField("tumor_stage", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lymph">Lymph Nodes Examined Positive</Label>
              <Input
                id="lymph"
                type="number"
                min="0"
                value={formData.lymph_nodes_examined_positive}
                onChange={(e) => updateField("lymph_nodes_examined_positive", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mutation">Mutation Count</Label>
              <Input
                id="mutation"
                type="number"
                min="0"
                value={formData.mutation_count}
                onChange={(e) => updateField("mutation_count", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npi">Nottingham Prognostic Index</Label>
              <Input
                id="npi"
                type="number"
                step="0.1"
                value={formData.nottingham_prognostic_index}
                onChange={(e) => updateField("nottingham_prognostic_index", Number(e.target.value))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genetic Data Section */}
      <Card className="shadow-medical border-border/50">
        <CardHeader className="bg-gradient-medical">
          <CardTitle className="text-secondary">Genetic Data</CardTitle>
          <CardDescription>Gene expression markers (0 = Not expressed, 1 = Expressed)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: "brca1", label: "BRCA1" },
              { key: "brca2", label: "BRCA2" },
              { key: "tp53", label: "TP53" },
              { key: "erbb2", label: "ERBB2" },
              { key: "esr1", label: "ESR1" },
              { key: "pgr", label: "PGR" },
              { key: "akt1", label: "AKT1" },
              { key: "pik3ca", label: "PIK3CA" },
              { key: "mki67", label: "MKI67" },
              { key: "cdh1", label: "CDH1" },
            ].map((gene) => (
              <div key={gene.key} className="space-y-2">
                <Label htmlFor={gene.key} className="text-sm font-medium">
                  {gene.label}
                </Label>
                <Input
                  id={gene.key}
                  type="number"
                  min="0"
                  max="1"
                  value={formData[gene.key as keyof PatientData]}
                  onChange={(e) => updateField(gene.key as keyof PatientData, Number(e.target.value))}
                  required
                  className="text-center"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-primary shadow-medical"
        >
          Predict Treatment
        </Button>
      </div>
    </motion.form>
  );
};
