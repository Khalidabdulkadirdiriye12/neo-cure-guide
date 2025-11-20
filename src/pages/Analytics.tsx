import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Activity, Users, Target, Award } from "lucide-react";

const Analytics = () => {
  // Static data for model performance
  const modelPerformanceData = [
    { name: "Treatment Predictor", accuracy: 92, precision: 89, recall: 91 },
    { name: "Survival Prediction", accuracy: 88, precision: 86, recall: 87 },
    { name: "Tumor Detection", accuracy: 94, precision: 93, recall: 92 },
  ];

  // Static data for prediction trends
  const predictionTrendsData = [
    { month: "Jan", treatment: 45, survival: 32, tumor: 28 },
    { month: "Feb", treatment: 52, survival: 38, tumor: 35 },
    { month: "Mar", treatment: 48, survival: 42, tumor: 31 },
    { month: "Apr", treatment: 61, survival: 45, tumor: 38 },
    { month: "May", treatment: 55, survival: 51, tumor: 42 },
    { month: "Jun", treatment: 67, survival: 48, tumor: 45 },
  ];

  // Static data for confidence distribution
  const confidenceData = [
    { range: "90-100%", count: 145, fill: "hsl(var(--chart-1))" },
    { range: "80-89%", count: 98, fill: "hsl(var(--chart-2))" },
    { range: "70-79%", count: 52, fill: "hsl(var(--chart-3))" },
    { range: "<70%", count: 23, fill: "hsl(var(--chart-4))" },
  ];

  // Static data for doctor performance
  const doctorPerformanceData = [
    { name: "Dr. Smith", predictions: 87, accuracy: 91 },
    { name: "Dr. Johnson", predictions: 76, accuracy: 89 },
    { name: "Dr. Williams", predictions: 65, accuracy: 93 },
    { name: "Dr. Brown", predictions: 54, accuracy: 88 },
    { name: "Dr. Davis", predictions: 48, accuracy: 90 },
  ];

  // Static data for success rates
  const successRateData = [
    { category: "Successful", value: 276, fill: "hsl(var(--chart-1))" },
    { category: "Partial Success", value: 42, fill: "hsl(var(--chart-3))" },
    { category: "Needs Review", value: 18, fill: "hsl(var(--chart-5))" },
  ];

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Advanced Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor model performance, prediction trends, and doctor activity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Overall Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">91.3%</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+2.4%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Total Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+156</span> this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Active Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <span>Making predictions</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">82.1%</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">+1.2%</span> improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Metrics</CardTitle>
            <CardDescription>Accuracy, precision, and recall by model type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="accuracy" fill="hsl(var(--chart-1))" name="Accuracy" />
                <Bar dataKey="precision" fill="hsl(var(--chart-2))" name="Precision" />
                <Bar dataKey="recall" fill="hsl(var(--chart-3))" name="Recall" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Confidence Distribution</CardTitle>
            <CardDescription>Distribution of model confidence scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Trends Over Time</CardTitle>
            <CardDescription>Monthly prediction volume by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionTrendsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="treatment" stroke="hsl(var(--chart-1))" name="Treatment" strokeWidth={2} />
                <Line type="monotone" dataKey="survival" stroke="hsl(var(--chart-2))" name="Survival" strokeWidth={2} />
                <Line type="monotone" dataKey="tumor" stroke="hsl(var(--chart-3))" name="Tumor Detection" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treatment Success Rate</CardTitle>
            <CardDescription>Outcome distribution of predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={successRateData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {successRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Performance Analytics</CardTitle>
          <CardDescription>Prediction volume and accuracy by doctor</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={doctorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="predictions" fill="hsl(var(--chart-1))" name="Total Predictions" />
              <Bar yAxisId="right" dataKey="accuracy" fill="hsl(var(--chart-2))" name="Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
