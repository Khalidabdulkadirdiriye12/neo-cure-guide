import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Shield } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "doctor" as "doctor" | "admin",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(API_ENDPOINTS.register, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast({
        title: "Success",
        description: `User ${formData.first_name} ${formData.last_name} registered successfully.`,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "doctor",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || 
                     error.response?.data?.email?.[0] || 
                     "Failed to register user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-medical">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Register New User</CardTitle>
                <CardDescription>
                  Create a new doctor or admin account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                    minLength={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "doctor" | "admin") => handleChange("role", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role" className="pl-10">
                    <Shield className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterUser;
