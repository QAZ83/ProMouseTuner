import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
  Sliders,
  Download,
  Share2,
} from "lucide-react";
import {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
} from "@/components/ui/recharts";

interface PerformanceChartsProps {
  charts?: {
    id: string;
    title: string;
    description: string;
    type: "line" | "bar" | "pie" | "area";
    data: any;
  }[];
  timeRanges?: string[];
  onChartTypeChange?: (chartId: string, type: string) => void;
  onTimeRangeChange?: (range: string) => void;
  onExportData?: () => void;
  onShareChart?: () => void;
  onCustomizeDisplay?: () => void;
}

const PerformanceCharts = ({
  charts = [
    {
      id: "accuracy",
      title: "Accuracy Metrics",
      description: "Tracking your mouse accuracy over time",
      type: "line",
      data: [65, 70, 80, 75, 85, 90, 88],
    },
    {
      id: "speed",
      title: "Speed Performance",
      description: "Mouse movement speed metrics",
      type: "bar",
      data: [120, 140, 135, 150, 160, 155, 170],
    },
    {
      id: "consistency",
      title: "Consistency Score",
      description: "How consistent your mouse movements are",
      type: "area",
      data: [75, 72, 78, 80, 82, 85, 83],
    },
    {
      id: "gameComparison",
      title: "Game Performance Comparison",
      description: "Performance metrics across different games",
      type: "pie",
      data: [30, 25, 20, 15, 10],
    },
  ],
  timeRanges = [
    "Last 24 Hours",
    "Last Week",
    "Last Month",
    "Last 3 Months",
    "Last Year",
    "All Time",
  ],
  onChartTypeChange = () => {},
  onTimeRangeChange = () => {},
  onExportData = () => {},
  onShareChart = () => {},
  onCustomizeDisplay = () => {},
}: PerformanceChartsProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[1]);
  const [activeTab, setActiveTab] = useState("all");

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    onTimeRangeChange(value);
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case "line":
        return <LineChartIcon className="h-5 w-5" />;
      case "bar":
        return <BarChartIcon className="h-5 w-5" />;
      case "pie":
        return <PieChartIcon className="h-5 w-5" />;
      case "area":
        return <AreaChartIcon className="h-5 w-5" />;
      default:
        return <LineChartIcon className="h-5 w-5" />;
    }
  };

  // Generate sample data for charts
  const generateChartData = (chart: any) => {
    if (chart.type === "pie") {
      return [
        { name: "FPS Games", value: 30 },
        { name: "MOBA Games", value: 25 },
        { name: "RTS Games", value: 20 },
        { name: "Racing Games", value: 15 },
        { name: "Other", value: 10 },
      ];
    }

    // For line, bar, area charts
    return [
      { name: "Mon", value: chart.data[0] },
      { name: "Tue", value: chart.data[1] },
      { name: "Wed", value: chart.data[2] },
      { name: "Thu", value: chart.data[3] },
      { name: "Fri", value: chart.data[4] },
      { name: "Sat", value: chart.data[5] },
      { name: "Sun", value: chart.data[6] },
    ];
  };

  // Render chart based on type
  const renderChart = (chart: any) => {
    const chartData = generateChartData(chart);

    switch (chart.type) {
      case "line":
        return <LineChart data={chartData} height={250} />;
      case "bar":
        return <BarChart data={chartData} height={250} />;
      case "area":
        return <AreaChart data={chartData} height={250} />;
      case "pie":
        return <PieChart data={chartData} height={250} />;
      default:
        return (
          <div className="h-64 w-full bg-muted/20 rounded-md flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {getChartIcon(chart.type)}
              </div>
              <p className="text-sm text-muted-foreground">
                {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
                for {chart.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Data points: {chart.data.length}
              </p>
            </div>
          </div>
        );
    }
  };

  const filteredCharts =
    activeTab === "all"
      ? charts
      : charts.filter((chart) => chart.id === activeTab);

  return (
    <div className="w-full bg-background p-4 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold">Performance Analytics</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={selectedTimeRange}
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={onShareChart}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={onCustomizeDisplay}>
                <Sliders className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Charts</TabsTrigger>
            {charts.map((chart) => (
              <TabsTrigger key={chart.id} value={chart.id}>
                {chart.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {charts.map((chart) => (
                <Card key={chart.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{chart.title}</CardTitle>
                        <CardDescription>{chart.description}</CardDescription>
                      </div>
                      <Select
                        defaultValue={chart.type}
                        onValueChange={(value) =>
                          onChartTypeChange(chart.id, value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Chart type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="area">Area Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>{renderChart(chart)}</CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {charts.map((chart) => (
            <TabsContent key={chart.id} value={chart.id}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{chart.title}</CardTitle>
                      <CardDescription>{chart.description}</CardDescription>
                    </div>
                    <Select
                      defaultValue={chart.type}
                      onValueChange={(value) =>
                        onChartTypeChange(chart.id, value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96">{renderChart(chart)}</div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={onExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={onShareChart}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default PerformanceCharts;
