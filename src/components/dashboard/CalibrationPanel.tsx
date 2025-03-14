import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, RotateCw } from "lucide-react";
import CalibrationTest from "./calibration/CalibrationTest";
import CalibrationResults from "./calibration/CalibrationResults";
import { useMouseSettingsContext } from "@/context/MouseSettingsContext";
import DeviceStatus from "./DeviceStatus";

interface TestResults {
  accuracy: number;
  speed: number;
  tracking: number;
  overall: number;
}

interface CalibrationPanelProps {
  onSettingsApply?: () => void;
}

const CalibrationPanel = ({
  onSettingsApply = () => {},
}: CalibrationPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("test");
  const [testResults, setTestResults] = useState<TestResults>({
    accuracy: 0,
    speed: 0,
    tracking: 0,
    overall: 0,
  });
  const [recommendations, setRecommendations] = useState({
    dpi: 800,
    pollingRate: 1000,
    acceleration: false,
    liftOffDistance: "medium",
  });
  const [calibrationComplete, setCalibrationComplete] = useState(false);

  const { updateSettings, saveCalibrationResults } = useMouseSettingsContext();

  // Handle test completion
  const handleTestComplete = (results: TestResults) => {
    setTestResults(results);

    // Save results to context
    saveCalibrationResults(results);

    // Only move to results tab if all tests are completed
    if (results.accuracy > 0 && results.speed > 0 && results.tracking > 0) {
      setCalibrationComplete(true);

      // Generate recommendations based on test results
      // This is a simplified example - in a real app, this would use more complex logic
      const newRecommendations = {
        dpi: results.accuracy > 80 ? 800 : 600,
        pollingRate: results.speed > 80 ? 1000 : 500,
        acceleration: results.tracking < 70,
        liftOffDistance: results.overall > 85 ? "low" : "medium",
      };

      setRecommendations(newRecommendations);
    }
  };

  // Handle applying settings
  const handleApplySettings = () => {
    // Apply the settings to the mouse via context
    updateSettings({
      dpi: recommendations.dpi,
      pollingRate: recommendations.pollingRate,
      acceleration: recommendations.acceleration,
      liftOffDistance:
        recommendations.liftOffDistance === "low"
          ? 1
          : recommendations.liftOffDistance === "medium"
            ? 2
            : 3,
    });

    onSettingsApply();

    // Reset the calibration process
    setActiveTab("test");
  };

  // Handle modifying settings
  const handleModifySettings = () => {
    // Switch to settings tab
    setActiveTab("test");
  };

  // Reset the calibration process
  const resetCalibration = () => {
    setTestResults({
      accuracy: 0,
      speed: 0,
      tracking: 0,
      overall: 0,
    });
    setCalibrationComplete(false);
    setActiveTab("test");
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mouse Calibration</h1>
          <p className="text-gray-500">
            Complete the tests below to optimize your mouse performance for
            gaming
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="test" className="px-6">
                    Calibration Tests
                  </TabsTrigger>
                  <TabsTrigger
                    value="results"
                    className="px-6"
                    disabled={!calibrationComplete}
                  >
                    Results & Recommendations
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCalibration}
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  {calibrationComplete && (
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("results")}
                      className="gap-1"
                    >
                      View Results
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="test" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <CalibrationTest onComplete={handleTestComplete} />
                  </CardContent>
                </Card>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {testResults.accuracy > 0 ? "✓" : "○"} Accuracy Test
                    {testResults.speed > 0 ? " • ✓" : " • ○"} Speed Test
                    {testResults.tracking > 0 ? " • ✓" : " • ○"} Tracking Test
                  </div>

                  {calibrationComplete && (
                    <Button onClick={() => setActiveTab("results")}>
                      Continue to Results
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="results" className="mt-0">
                <CalibrationResults
                  results={testResults}
                  recommendations={recommendations}
                  onApply={handleApplySettings}
                  onModify={handleModifySettings}
                />

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("test")}
                    className="mr-2"
                  >
                    Back to Tests
                  </Button>
                  <Button onClick={handleApplySettings} className="gap-1">
                    <Settings className="h-4 w-4" />
                    Apply Settings
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <DeviceStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalibrationPanel;
