import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/pages/PatientManagement";
import { Calendar, Mail, Phone, User, Activity, FileText } from "lucide-react";

interface PatientDetailsDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetailsDialog({ patient, open, onOpenChange }: PatientDetailsDialogProps) {
  if (!patient) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl">{patient.name}</DialogTitle>
            <Badge className={getStatusColor(patient.status)}>
              {patient.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
              
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Age & Gender</p>
                  <p className="font-medium">{patient.age} years • {patient.gender}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{patient.contact}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Medical Information</h3>
              
              <div className="flex items-center gap-3 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Diagnosis</p>
                  <p className="font-medium">{patient.diagnosis}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Stage</p>
                  <p className="font-medium">{patient.stage}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Last Visit</p>
                  <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {patient.medicalHistory && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg border-b pb-2">Medical History</h3>
              <div className="p-4 rounded-lg bg-secondary/30 border">
                <p className="text-sm leading-relaxed">{patient.medicalHistory}</p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Patient ID:</strong> {patient.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
