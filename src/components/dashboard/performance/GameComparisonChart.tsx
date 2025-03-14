import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, PieChart } from "@/components/ui/recharts";

interface GameComparisonChartProps {
  data?: any;
  className?: string;
}

const GameComparisonChart = ({
  data = {
    performance: [
      { name: "CS2", accuracy: 85, speed: 78, tracking: 92 },
      { name: "Valorant", accuracy: 82, speed: 80, tracking: 88 },
      { name: "Apex", accuracy: 75, speed: 85, tracking: 80 },
      { name: "Fortnite", accuracy: 70, speed: 75, tracking: 72 },
    ],
    timeSpent: [
      { name: "CS2", value: 45 },
      { name: "Valorant", value: 30 },
      { name: "Apex", value: 15 },
      { name: "Fortnite", value: 10 },
    ],
  },
  className,
}: GameComparisonChartProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Game Performance Comparison</CardTitle>
        <CardDescription>
          Compare your mouse performance across different games
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="time">Time Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="pt-4">
            <div className="h-[350px]">
              <BarChart data={data.performance} height={350} />
            </div>
          </TabsContent>

          <TabsContent value="time" className="pt-4">
            <div className="h-[350px]">
              <PieChart data={data.timeSpent} height={350} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GameComparisonChart;
