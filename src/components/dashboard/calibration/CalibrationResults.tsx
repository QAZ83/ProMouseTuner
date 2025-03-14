import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle, ChevronRight } from "lucide-react";

interface CalibrationResultsProps {
  results?: {
    accuracy: number;
    speed: number;
    tracking: number;
    overall: number;
  };
  recommendations?: {
    dpi: number;
    pollingRate: number;
    acceleration: boolean;
    liftOffDistance: string;
  };
  onApply?: () => void;
  onModify?: () => void;
}

const CalibrationResults = ({
  results = {
    accuracy: 85,
    speed: 78,
    tracking: 92,
    overall: 85,
  },
  recommendations = {
    dpi: 800,
    pollingRate: 1000,
    acceleration: false,
    liftOffDistance: "medium",
  },
  onApply = () => console.log("Applied settings"),
  onModify = () => console.log("Modify settings"),
}: CalibrationResultsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-background p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Calibration Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Test Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Performance</CardTitle>
            <CardDescription>Your mouse performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm font-medium">{results.accuracy}%</span>
              </div>
              <Progress value={results.accuracy} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Speed</span>
                <span className="text-sm font-medium">{results.speed}%</span>
              </div>
              <Progress value={results.speed} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tracking</span>
                <span className="text-sm font-medium">{results.tracking}%</span>
              </div>
              <Progress value={results.tracking} className="h-2" />
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">
                  Overall Performance
                </span>
                <span className="text-base font-semibold">
                  {results.overall}%
                </span>
              </div>
              <Progress value={results.overall} className="h-3 mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Settings</CardTitle>
            <CardDescription>Optimized for your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">DPI Setting</p>
                  <p className="text-sm text-muted-foreground">
                    {recommendations.dpi} DPI (dots per inch)
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Polling Rate</p>
                  <p className="text-sm text-muted-foreground">
                    {recommendations.pollingRate}Hz
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-1 rounded-full">
                  {recommendations.acceleration ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Mouse Acceleration</p>
                  <p className="text-sm text-muted-foreground">
                    {recommendations.acceleration ? "Enabled" : "Disabled"} for
                    optimal control
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <div className="mt-0.5 bg-primary/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Lift-off Distance</p>
                  <p className="text-sm text-muted-foreground">
                    {recommendations.liftOffDistance.charAt(0).toUpperCase() +
                      recommendations.liftOffDistance.slice(1)}{" "}
                    setting
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={onModify}
          className="flex items-center gap-2"
        >
          Modify Settings
        </Button>
        <Button onClick={onApply} className="flex items-center gap-2">
          Apply Recommended Settings
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalibrationResults;
