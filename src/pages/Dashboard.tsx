import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Activity, Image, TrendingUp } from "lucide-react";
import apiClient from "@/services/api";

interface DashboardStats {
  totalPatients: number;
  totalPredictions: number;
  imageAnalyses: number;
  survivalPredictions: number;
  treatmentPredictions: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalPredictions: 0,
    imageAnalyses: 0,
    survivalPredictions: 0,
    treatmentPredictions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch patients data
        const patientsResponse = await apiClient.get('/api/patients/');
        const patientsData = patientsResponse.data;

        // Fetch predictions data
        const predictionsResponse = await apiClient.get('/api/predictions/predictions/');
        const predictionsData = predictionsResponse.data;

        console.log('=== Dashboard Data ===');
        console.log('Patients:', patientsData);
        console.log('Predictions:', predictionsData);
        console.log('======================');

        // Count prediction types
        const imagePredictions = predictionsData.results.filter(
          (p: any) => p.prediction_type === 'image'
        ).length;
        const survivalPredictions = predictionsData.results.filter(
          (p: any) => p.prediction_type === 'survival'
        ).length;
        const treatmentPredictions = predictionsData.results.filter(
          (p: any) => p.prediction_type === 'treatment'
        ).length;

        setStats({
          totalPatients: patientsData.count,
          totalPredictions: predictionsData.count,
          imageAnalyses: imagePredictions,
          survivalPredictions: survivalPredictions,
          treatmentPredictions: treatmentPredictions,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data
  const predictionTypesChart = [
    { name: "Treatment", value: stats.treatmentPredictions, color: "hsl(var(--primary))" },
    { name: "Survival", value: stats.survivalPredictions, color: "hsl(var(--secondary))" },
    { name: "Image Analysis", value: stats.imageAnalyses, color: "hsl(var(--accent))" },
  ];

  const survivalRates = [
    { stage: "Stage I", rate: 92 },
    { stage: "Stage II", rate: 78 },
    { stage: "Stage III", rate: 54 },
    { stage: "Stage IV", rate: 28 },
  ];

  const patientsByMonth = [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 19 },
    { month: "Mar", count: 15 },
    { month: "Apr", count: 25 },
    { month: "May", count: 22 },
    { month: "Jun", count: 30 },
  ];

  const recentActivity = [
    { week: "Week 1", predictions: 8 },
    { week: "Week 2", predictions: 12 },
    { week: "Week 3", predictions: 15 },
    { week: "Week 4", predictions: 18 },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of patient data and predictions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Active patients in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictions Made</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPredictions}</div>
            <p className="text-xs text-muted-foreground">
              Total predictions recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Image Analyses</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.imageAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              Tumor detection scans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Survival Predictions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.survivalPredictions}</div>
            <p className="text-xs text-muted-foreground">
              Survival analyses completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patients by Month</CardTitle>
            <CardDescription>New patient registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientsByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Distribution</CardTitle>
            <CardDescription>Breakdown by prediction type</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={predictionTypesChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {predictionTypesChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Survival Rates by Stage</CardTitle>
            <CardDescription>Average survival rates across cancer stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={survivalRates}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="stage" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="rate" 
                  fill="hsl(var(--primary))" 
                  radius={[8, 8, 0, 0]}
                  name="Survival Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Predictions made in the last 4 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="predictions" 
                  fill="hsl(var(--secondary))" 
                  radius={[8, 8, 0, 0]}
                  name="Predictions"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
