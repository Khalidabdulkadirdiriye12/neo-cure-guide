import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Edit, Trash2, Eye, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PatientDialog } from "@/components/patients/PatientDialog";
import { PatientDetailsDialog } from "@/components/patients/PatientDetailsDialog";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { 
  listPatients, 
  createPatient, 
  patchPatient, 
  deletePatient as deletePatientApi,
  Patient,
  CreatePatientData 
} from "@/services/patientApi";

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  // Fetch patients on mount and when page changes
  useEffect(() => {
    fetchPatients();
  }, [currentPage]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await listPatients(currentPage);
      setPatients(response.results);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / 10)); // Assuming 10 items per page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch patients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.diagnosis?.toLowerCase().includes(query);
  });

  const handleAddPatient = async (patientData: CreatePatientData) => {
    try {
      const newPatient = await createPatient(patientData);
      toast({
        title: "Patient Added",
        description: `${patientData.first_name} ${patientData.last_name} has been added successfully.`,
      });
      setIsAddDialogOpen(false);
      fetchPatients(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPatient = async (patientData: CreatePatientData) => {
    if (!editingPatient) return;
    
    try {
      await patchPatient(editingPatient.id, patientData);
      toast({
        title: "Patient Updated",
        description: `${patientData.first_name} ${patientData.last_name}'s information has been updated.`,
      });
      setEditingPatient(null);
      fetchPatients(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePatient = async () => {
    if (!deletingPatient) return;
    
    try {
      await deletePatientApi(deletingPatient.id);
      toast({
        title: "Patient Removed",
        description: `${deletingPatient.first_name} ${deletingPatient.last_name} has been removed from the system.`,
      });
      setDeletingPatient(null);
      fetchPatients(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status?: Patient["status"]) => {
    if (!status) return "bg-secondary";
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
                {totalCount} total patients registered {totalPages > 1 && `• Page ${currentPage} of ${totalPages}`}
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
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
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
                              <h3 className="text-xl font-semibold">{patient.first_name} {patient.last_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {patient.date_of_birth} • {patient.gender}
                              </p>
                            </div>
                            {patient.status && (
                              <Badge className={getStatusColor(patient.status)}>
                                {patient.status}
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Diagnosis</p>
                              <p className="font-medium">{patient.diagnosis || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Stage</p>
                              <p className="font-medium">{patient.stage || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Contact</p>
                              <p className="font-medium">{patient.contact || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Email</p>
                              <p className="font-medium">{patient.email || "N/A"}</p>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t mt-6">
              <p className="text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
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
