import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Search, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PatientDialog } from "@/components/patients/PatientDialog";
import { PatientDetailsDialog } from "@/components/patients/PatientDetailsDialog";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  email: string;
  diagnosis: string;
  stage: string;
  lastVisit: string;
  status: "Active" | "Under Treatment" | "Recovered" | "Critical";
  medicalHistory?: string;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 45,
    gender: "Female",
    contact: "+1234567890",
    email: "sarah.j@email.com",
    diagnosis: "Breast Cancer",
    stage: "Stage II",
    lastVisit: "2025-10-28",
    status: "Under Treatment",
    medicalHistory: "Hypertension, Type 2 Diabetes"
  },
  {
    id: "2",
    name: "Emily Chen",
    age: 52,
    gender: "Female",
    contact: "+1234567891",
    email: "emily.c@email.com",
    diagnosis: "Breast Cancer",
    stage: "Stage I",
    lastVisit: "2025-10-30",
    status: "Active",
    medicalHistory: "None"
  }
];

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = (patientData: Omit<Patient, "id">) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
    };
    setPatients([...patients, newPatient]);
    setIsAddDialogOpen(false);
    toast({
      title: "Patient Added",
      description: `${patientData.name} has been added successfully.`,
    });
  };

  const handleEditPatient = (patientData: Omit<Patient, "id">) => {
    if (!editingPatient) return;
    
    setPatients(patients.map(p => 
      p.id === editingPatient.id ? { ...patientData, id: editingPatient.id } : p
    ));
    setEditingPatient(null);
    toast({
      title: "Patient Updated",
      description: `${patientData.name}'s information has been updated.`,
    });
  };

  const handleDeletePatient = () => {
    if (!deletingPatient) return;
    
    setPatients(patients.filter(p => p.id !== deletingPatient.id));
    toast({
      title: "Patient Removed",
      description: `${deletingPatient.name} has been removed from the system.`,
      variant: "destructive",
    });
    setDeletingPatient(null);
  };

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "Active": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Under Treatment": return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "Recovered": return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "Critical": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Patient Management
            </h2>
            <p className="text-muted-foreground mt-2">
              Manage patient records, medical history, and treatment plans
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </motion.div>

      <Card className="shadow-medical">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Patient Records
              </CardTitle>
              <CardDescription>
                {patients.length} total patients registered
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No patients found matching your search" : "No patients registered yet"}
                </p>
              </div>
            ) : (
              filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {patient.age} years • {patient.gender}
                              </p>
                            </div>
                            <Badge className={getStatusColor(patient.status)}>
                              {patient.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Diagnosis</p>
                              <p className="font-medium">{patient.diagnosis}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Stage</p>
                              <p className="font-medium">{patient.stage}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Contact</p>
                              <p className="font-medium">{patient.contact}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last Visit</p>
                              <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setViewingPatient(patient)}
                            className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingPatient(patient)}
                            className="hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeletingPatient(patient)}
                            className="hover:bg-red-500/10 hover:text-red-600 hover:border-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <PatientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPatient}
      />

      <PatientDialog
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        onSubmit={handleEditPatient}
        patient={editingPatient || undefined}
      />

      <PatientDetailsDialog
        patient={viewingPatient}
        open={!!viewingPatient}
        onOpenChange={(open) => !open && setViewingPatient(null)}
      />

      <DeletePatientDialog
        patient={deletingPatient}
        open={!!deletingPatient}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        onConfirm={handleDeletePatient}
      />
    </div>
  );
};

export default PatientManagement;
