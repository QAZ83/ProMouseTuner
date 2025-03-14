import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, LineChart } from "@/components/ui/recharts";
import { Calendar, Download } from "lucide-react";

interface PerformanceHistoryProps {
  className?: string;
}

const PerformanceHistory = ({ className }: PerformanceHistoryProps) => {
  const [timeRange, setTimeRange] = useState("month");
  const [metricType, setMetricType] = useState("accuracy");

  // Sample data for different time ranges
  const data = {
    week: [
      { name: "Mon", accuracy: 75, speed: 68, tracking: 82 },
      { name: "Tue", accuracy: 78, speed: 70, tracking: 80 },
      { name: "Wed", accuracy: 80, speed: 75, tracking: 85 },
      { name: "Thu", accuracy: 77, speed: 72, tracking: 83 },
      { name: "Fri", accuracy: 82, speed: 78, tracking: 86 },
      { name: "Sat", accuracy: 85, speed: 80, tracking: 88 },
      { name: "Sun", accuracy: 83, speed: 79, tracking: 87 },
    ],
    month: [
      { name: "Week 1", accuracy: 75, speed: 68, tracking: 82 },
      { name: "Week 2", accuracy: 78, speed: 72, tracking: 84 },
      { name: "Week 3", accuracy: 82, speed: 76, tracking: 86 },
      { name: "Week 4", accuracy: 85, speed: 80, tracking: 88 },
    ],
    year: [
      { name: "Jan", accuracy: 70, speed: 65, tracking: 75 },
      { name: "Feb", accuracy: 72, speed: 68, tracking: 78 },
      { name: "Mar", accuracy: 75, speed: 70, tracking: 80 },
      { name: "Apr", accuracy: 78, speed: 72, tracking: 82 },
      { name: "May", accuracy: 80, speed: 75, tracking: 84 },
      { name: "Jun", accuracy: 82, speed: 78, tracking: 86 },
      { name: "Jul", accuracy: 85, speed: 80, tracking: 88 },
      { name: "Aug", accuracy: 83, speed: 79, tracking: 87 },
      { name: "Sep", accuracy: 84, speed: 81, tracking: 89 },
      { name: "Oct", accuracy: 86, speed: 82, tracking: 90 },
      { name: "Nov", accuracy: 85, speed: 83, tracking: 91 },
      { name: "Dec", accuracy: 87, speed: 84, tracking: 92 },
    ],
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Performance History</CardTitle>
            <CardDescription>
              Track your performance improvements over time
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={metricType} onValueChange={setMetricType}>
          <TabsList className="mb-4">
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="speed">Speed</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="all">All Metrics</TabsTrigger>
          </TabsList>

          <div className="h-[350px] mt-4">
            {metricType === "all" ? (
              <LineChart
                data={data[timeRange as keyof typeof data]}
                height={350}
              />
            ) : (
              <AreaChart
                data={data[timeRange as keyof typeof data].map((item) => ({
                  name: item.name,
                  value: item[metricType as keyof typeof item],
                }))}
                height={350}
              />
            )}
          </div>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {timeRange === "week"
            ? "Last 7 days"
            : timeRange === "month"
              ? "Last 4 weeks"
              : "Last 12 months"}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PerformanceHistory;
