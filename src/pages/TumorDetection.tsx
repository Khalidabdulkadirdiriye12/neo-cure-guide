import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from "@/services/api";

interface PredictionResult {
  prediction: string;
  confidence: number;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  medical_record_number: string;
}

const TumorDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiClient.get('/api/patients/');
        setPatients(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to fetch patients. Please check your connection.",
          variant: "destructive",
        });
      }
    };
    fetchPatients();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setPrediction(null); // Reset prediction when new image is uploaded
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPatientId) {
      toast({
        title: "Patient Required",
        description: "Please select a patient before analyzing the image.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('patient_id', selectedPatientId);
      formData.append('doctor_id', user?.id || '');
      formData.append('prediction_type', 'image');

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://127.0.0.1:8000/api/image_predict/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setPrediction(data);
      
      toast({
        title: "Analysis Complete",
        description: `Prediction: ${data.prediction} (${(data.confidence * 100).toFixed(1)}% confidence)`,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to connect to the backend. Please ensure the server is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Breast Cancer Tumor Detection
        </h2>
        <p className="text-muted-foreground mt-2">
          Upload mammogram or histopathology images for AI-powered tumor detection
        </p>
      </motion.div>

      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Selection
          </CardTitle>
          <CardDescription>
            Select a patient for this prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="patient-select">Patient</Label>
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger id="patient-select">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.first_name} {patient.last_name} (MRN: {patient.medical_record_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-medical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Upload
          </CardTitle>
          <CardDescription>
            Upload breast cancer tumor images for analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG up to 10MB
              </p>
            </label>
          </div>

          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={selectedImage}
                  alt="Uploaded tumor"
                  className="w-full h-auto max-h-96 object-contain bg-muted"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="shadow-medical border-primary/30 bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className={`h-3 w-3 rounded-full ${
                  prediction.prediction.toLowerCase().includes('malignant') 
                    ? 'bg-red-500 animate-pulse' 
                    : 'bg-green-500 animate-pulse'
                }`} />
                Detection Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-secondary/50 border-2 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Classification</p>
                  <p className={`text-3xl font-bold ${
                    prediction.prediction.toLowerCase().includes('malignant')
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {prediction.prediction}
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-secondary/50 border-2 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                  <p className="text-3xl font-bold text-primary">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-primary/60"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  Model Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-card/50">
                    <span className="text-muted-foreground">Algorithm</span>
                    <span className="font-semibold">Simple CNN (Not Fine-tuned)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-card/50">
                    <span className="text-muted-foreground">Dataset</span>
                    <span className="font-semibold">Breast Cancer Histopathology</span>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-primary">Future Enhancement:</strong> We plan to implement 
                      Generative Adversarial Networks (GANs) to generate synthetic training data, 
                      which will significantly improve model accuracy and robustness.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ <strong>Medical Disclaimer:</strong> This AI tool is for research purposes only 
                  and should not replace professional medical diagnosis.
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
            This AI-powered tool analyzes breast cancer tumor images using a Simple CNN architecture.
          </p>
          <p>
            <strong>Current Model:</strong> Basic CNN without fine-tuning for rapid prototyping.
          </p>
          <p>
            <strong>Coming Soon:</strong> GANs for synthetic data generation to enhance model performance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TumorDetection;
