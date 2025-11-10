import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Search, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

interface Doctor {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  specialization: string;
  hospital: string;
  contact: string;
  bio: string;
  profile_image?: string;
}

interface DoctorFormData {
  user: number | null;
  specialization: string;
  hospital: string;
  contact: string;
  bio: string;
  profile_image?: File | null;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>({
    user: null,
    specialization: "",
    hospital: "",
    contact: "",
    bio: "",
    profile_image: null,
  });
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    fetchDoctors();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(API_ENDPOINTS.doctors, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const doctorsData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
      toast({
        title: "Error",
        description: "Failed to fetch doctors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(API_ENDPOINTS.users, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Users API Response:", response.data);
      
      const usersData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      
      console.log("Parsed users data:", usersData);
      console.log("Doctor role users:", usersData.filter((u: User) => u.role === 'doctor'));
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleAddDoctor = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formDataToSend = new FormData();
      
      formDataToSend.append('user', String(formData.user));
      formDataToSend.append('specialization', formData.specialization);
      formDataToSend.append('hospital', formData.hospital);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('bio', formData.bio);
      
      if (formData.profile_image) {
        formDataToSend.append('profile_image', formData.profile_image);
      }
      
      await axios.post(API_ENDPOINTS.doctors, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: "Doctor Added",
        description: "Doctor profile has been created successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
      fetchDoctors();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add doctor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditDoctor = async () => {
    if (!editingDoctor) return;
    try {
      const token = localStorage.getItem("accessToken");
      const formDataToSend = new FormData();
      
      formDataToSend.append('specialization', formData.specialization);
      formDataToSend.append('hospital', formData.hospital);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('bio', formData.bio);
      
      if (formData.profile_image) {
        formDataToSend.append('profile_image', formData.profile_image);
      }
      
      await axios.patch(`${API_ENDPOINTS.doctors}${editingDoctor.id}/`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: "Doctor Updated",
        description: "Doctor profile has been updated successfully.",
      });
      setEditingDoctor(null);
      resetForm();
      fetchDoctors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update doctor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDoctor = async () => {
    if (!deletingDoctor) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${API_ENDPOINTS.doctors}${deletingDoctor.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Doctor Deleted",
        description: "Doctor profile has been removed successfully.",
      });
      setDeletingDoctor(null);
      fetchDoctors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete doctor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      user: null,
      specialization: "",
      hospital: "",
      contact: "",
      bio: "",
      profile_image: null,
    });
  };

  const openEditDialog = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      user: doctor.user.id,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      contact: doctor.contact,
      bio: doctor.bio,
    });
  };

  // Filter out current user's profile if they're a doctor
  const filteredDoctors = doctors
    .filter((doctor) => {
      // If current user is a doctor, exclude their own profile
      if (!isAdmin && user?.id && doctor.user.id === parseInt(user.id)) {
        return false;
      }
      
      const fullName = `${doctor.user.first_name} ${doctor.user.last_name}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        fullName.includes(query) ||
        doctor.user.email.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.hospital.toLowerCase().includes(query)
      );
    });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Doctor Management
            </h2>
            <p className="text-muted-foreground mt-2">
              {isAdmin ? "Manage doctor profiles and information" : "View doctor profiles"}
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              className="gap-2 w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4" />
              Add Doctor
            </Button>
          )}
        </div>
      </motion.div>

      <Card className="shadow-medical">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Doctor Profiles
              </CardTitle>
              <CardDescription>{filteredDoctors.length} doctors</CardDescription>
            </div>
            <div className="relative w-full lg:w-auto lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">
                          {doctor.user.first_name} {doctor.user.last_name}
                        </TableCell>
                        <TableCell>{doctor.user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{doctor.specialization}</Badge>
                        </TableCell>
                        <TableCell>{doctor.hospital}</TableCell>
                        <TableCell>{doctor.contact}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setViewingDoctor(doctor)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openEditDialog(doctor)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setDeletingDoctor(doctor)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">
                            {doctor.user.first_name} {doctor.user.last_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-sm">{doctor.user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Specialization</p>
                          <Badge variant="secondary">{doctor.specialization}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Hospital</p>
                          <p className="text-sm">{doctor.hospital}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p className="text-sm">{doctor.contact}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingDoctor(doctor)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {isAdmin && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(doctor)}
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingDoctor(doctor)}
                                className="flex-1"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Doctor Dialog */}
      <Dialog open={!!viewingDoctor} onOpenChange={() => setViewingDoctor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor Profile</DialogTitle>
          </DialogHeader>
          {viewingDoctor && (
            <div className="space-y-4">
              {viewingDoctor.profile_image && (
                <div className="flex justify-center">
                  <img 
                    src={viewingDoctor.profile_image} 
                    alt="Profile" 
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">
                    {viewingDoctor.user.first_name} {viewingDoctor.user.last_name}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{viewingDoctor.user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Specialization</Label>
                  <p className="font-medium">{viewingDoctor.specialization}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hospital</Label>
                  <p className="font-medium">{viewingDoctor.hospital}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p className="font-medium">{viewingDoctor.contact}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <Badge>{viewingDoctor.user.role}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Bio</Label>
                <p className="mt-2 text-sm">{viewingDoctor.bio}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingDoctor(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Doctor Dialog */}
      <Dialog
        open={isAddDialogOpen || !!editingDoctor}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingDoctor(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            <DialogDescription>
              {editingDoctor
                ? "Update doctor profile information."
                : "Create a new doctor profile."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!editingDoctor && (
              <div className="space-y-2">
                <Label htmlFor="user">User (Doctor Role Only)</Label>
                <select
                  id="user"
                  value={formData.user || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, user: parseInt(e.target.value) })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a user</option>
                  {users
                    .filter((user) => {
                      const isDoctor = user.role?.toLowerCase() === 'doctor';
                      const hasProfile = doctors.some((doctor) => doctor.user.id === user.id);
                      return isDoctor && !hasProfile;
                    })
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name || 'No name'} {user.last_name || ''} ({user.email})
                      </option>
                    ))}
                </select>
                {users.filter((user) => user.role?.toLowerCase() === 'doctor' && !doctors.some((doctor) => doctor.user.id === user.id)).length === 0 && (
                  <p className="text-sm text-muted-foreground">No doctor role users available. Please create a user with doctor role first.</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="profile_image">Profile Image</Label>
              <Input
                id="profile_image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, profile_image: file });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                placeholder="e.g., Oncology"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Input
                id="hospital"
                value={formData.hospital}
                onChange={(e) =>
                  setFormData({ ...formData, hospital: e.target.value })
                }
                placeholder="e.g., Nasri Hospital"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="e.g., 072829922"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Brief description about the doctor..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingDoctor(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingDoctor ? handleEditDoctor : handleAddDoctor}>
              {editingDoctor ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingDoctor} onOpenChange={() => setDeletingDoctor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deletingDoctor?.user.first_name} {deletingDoctor?.user.last_name}
              </strong>
              's profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingDoctor(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDoctor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorManagement;
