import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCog, Activity, TrendingUp } from "lucide-react";
import apiClient from "@/services/api";
import { LoadingAnimation } from "@/components/LoadingAnimation";

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalPredictions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalPredictions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const [usersRes, doctorsRes, patientsRes, predictionsRes] = await Promise.all([
        apiClient.get("/api/auth/users/"),
        apiClient.get("/api/doctors/"),
        apiClient.get("/api/patients/"),
        apiClient.get("/api/predictions/predictions/"),
      ]);

      setStats({
        totalUsers: usersRes.data.count || usersRes.data.length || 0,
        totalDoctors: doctorsRes.data.count || doctorsRes.data.length || 0,
        totalPatients: patientsRes.data.count || 0,
        totalPredictions: predictionsRes.data.count || 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingAnimation />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users in the system",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      description: "Active medical professionals",
      icon: UserCog,
      color: "text-green-500",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      description: "Patients under care",
      icon: Activity,
      color: "text-purple-500",
    },
    {
      title: "Total Predictions",
      value: stats.totalPredictions,
      description: "AI predictions made",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and management statistics
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage users, doctors, and system settings
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <a
              href="/user-management"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage system users
                </p>
              </div>
            </a>
            <a
              href="/doctor-management"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <UserCog className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Doctor Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage doctors
                </p>
              </div>
            </a>
            <a
              href="/predictions-history"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Predictions History</h3>
                <p className="text-sm text-muted-foreground">
                  View all predictions
                </p>
              </div>
            </a>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
