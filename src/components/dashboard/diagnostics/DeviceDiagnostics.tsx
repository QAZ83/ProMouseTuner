import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Activity,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Cpu,
  Battery,
  Bluetooth,
  Wifi,
  Zap,
  Gauge,
  MousePointer,
  HardDrive,
} from "lucide-react";

interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  status: "passed" | "failed" | "warning" | "pending" | "running";
  details?: string;
  value?: number;
}

interface DeviceSpecs {
  sensor: string;
  maxDPI: number;
  pollingRate: number;
  buttons: number;
  connectivity: string[];
  batteryLife: string;
  weight: string;
  dimensions: string;
}

interface DeviceDiagnosticsProps {
  deviceName?: string;
  deviceModel?: string;
  onRunDiagnostics?: () => Promise<DiagnosticTest[]>;
  onGetDeviceSpecs?: () => Promise<DeviceSpecs>;
}

const DeviceDiagnostics = ({
  deviceName = "ProMouseTuner G502",
  deviceModel = "G502 LIGHTSPEED",
  onRunDiagnostics = mockRunDiagnostics,
  onGetDeviceSpecs = mockGetDeviceSpecs,
}: DeviceDiagnosticsProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [diagnosticTests, setDiagnosticTests] = useState<DiagnosticTest[]>([]);
  const [deviceSpecs, setDeviceSpecs] = useState<DeviceSpecs | null>(null);
  const [activeTab, setActiveTab] = useState("tests");

  useEffect(() => {
    // Get device specs on initial load
    fetchDeviceSpecs();
  }, []);

  const fetchDeviceSpecs = async () => {
    try {
      const specs = await onGetDeviceSpecs();
      setDeviceSpecs(specs);
    } catch (err) {
      console.error("Failed to get device specs:", err);
    }
  };

  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    setProgress(0);
    setError(null);
    setSuccess(null);
    setDiagnosticTests([]);

    try {
      // Initialize all tests as pending
      const initialTests = await onRunDiagnostics();
      setDiagnosticTests(
        initialTests.map((test) => ({ ...test, status: "pending" })),
      );

      // Simulate running each test sequentially
      for (let i = 0; i < initialTests.length; i++) {
        // Update current test to running
        setDiagnosticTests((prev) =>
          prev.map((test, index) =>
            index === i ? { ...test, status: "running" } : test,
          ),
        );

        // Simulate test running time
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 2000),
        );

        // Update progress
        const newProgress = ((i + 1) / initialTests.length) * 100;
        setProgress(newProgress);

        // Update test result (use the mock result)
        setDiagnosticTests((prev) =>
          prev.map((test, index) =>
            index === i ? { ...initialTests[i] } : test,
          ),
        );
      }

      // Check if any tests failed
      const failedTests = initialTests.filter(
        (test) => test.status === "failed",
      );
      const warningTests = initialTests.filter(
        (test) => test.status === "warning",
      );

      if (failedTests.length > 0) {
        setError(
          `${failedTests.length} test${failedTests.length > 1 ? "s" : ""} failed. Please check the results.`,
        );
      } else if (warningTests.length > 0) {
        setSuccess(
          `Diagnostics completed with ${warningTests.length} warning${warningTests.length > 1 ? "s" : ""}.`,
        );
      } else {
        setSuccess("All diagnostic tests passed successfully!");
      }
    } catch (err) {
      setError("Failed to run diagnostics");
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "running":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Passed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
            Warning
          </Badge>
        );
      case "running":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Running
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Device Diagnostics
            </CardTitle>
            <CardDescription>
              Run diagnostics to check the health of your {deviceName}
            </CardDescription>
          </div>
          <Button
            onClick={handleRunDiagnostics}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
            {isRunning ? "Running Diagnostics..." : "Run Diagnostics"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert
            className={`${success.includes("warning") ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}
          >
            <AlertDescription
              className={`${success.includes("warning") ? "text-amber-800" : "text-green-800"}`}
            >
              {success}
            </AlertDescription>
          </Alert>
        )}

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running diagnostics...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tests">Diagnostic Tests</TabsTrigger>
            <TabsTrigger value="specs">Device Specifications</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-4 pt-4">
            {diagnosticTests.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No diagnostic data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Run diagnostics to check your device's health and performance.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {diagnosticTests.map((test) => (
                  <div
                    key={test.id}
                    className={`border rounded-lg p-4 ${test.status === "passed" ? "bg-green-50/50" : test.status === "failed" ? "bg-red-50/50" : test.status === "warning" ? "bg-amber-50/50" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getStatusIcon(test.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{test.name}</h3>
                            {getStatusBadge(test.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {test.description}
                          </p>
                          {test.details && (
                            <p className="text-sm mt-2">{test.details}</p>
                          )}
                          {test.value !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-sm">
                                <span>Value:</span>
                                <span>{test.value}</span>
                              </div>
                              <Progress
                                value={test.value}
                                className="h-1.5 mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="specs" className="pt-4">
            {deviceSpecs ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <HardDrive className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">{deviceModel}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Hardware</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Sensor</span>
                        <span>{deviceSpecs.sensor}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Max DPI</span>
                        <span>{deviceSpecs.maxDPI.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Polling Rate
                        </span>
                        <span>{deviceSpecs.pollingRate} Hz</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Buttons</span>
                        <span>{deviceSpecs.buttons}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Power & Connectivity</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Connectivity
                        </span>
                        <div className="flex items-center gap-1">
                          {deviceSpecs.connectivity.includes("Wireless") && (
                            <Wifi className="h-3 w-3" />
                          )}
                          {deviceSpecs.connectivity.includes("Bluetooth") && (
                            <Bluetooth className="h-3 w-3" />
                          )}
                          <span>{deviceSpecs.connectivity.join(", ")}</span>
                        </div>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Battery Life
                        </span>
                        <div className="flex items-center gap-1">
                          <Battery className="h-3 w-3" />
                          <span>{deviceSpecs.batteryLife}</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Physical</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Weight</span>
                        <span>{deviceSpecs.weight}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dimensions
                        </span>
                        <span>{deviceSpecs.dimensions}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">Performance</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">DPI Range</span>
                        <span>100 - {deviceSpecs.maxDPI.toLocaleString()}</span>
                      </div>
                      <Progress value={80} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Polling Rate
                        </span>
                        <span>125 - {deviceSpecs.pollingRate} Hz</span>
                      </div>
                      <Progress value={90} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">
                  Device specs unavailable
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Unable to retrieve device specifications. Please check your
                  connection and try again.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          <span>
            If you encounter persistent issues, please contact support for
            assistance.
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Mock functions for demonstration
async function mockRunDiagnostics(): Promise<DiagnosticTest[]> {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: "sensor",
      name: "Sensor Test",
      description:
        "Checks the mouse sensor for tracking accuracy and responsiveness",
      status: "passed",
      details: "Sensor is functioning optimally",
      value: 95,
    },
    {
      id: "buttons",
      name: "Button Test",
      description: "Verifies all buttons are registering clicks correctly",
      status: "passed",
      details: "All buttons are responding as expected",
      value: 100,
    },
    {
      id: "wireless",
      name: "Wireless Connection",
      description: "Tests the stability and latency of the wireless connection",
      status: Math.random() > 0.7 ? "warning" : "passed",
      details:
        Math.random() > 0.7
          ? "Occasional signal interference detected"
          : "Connection is stable",
      value: Math.random() > 0.7 ? 75 : 90,
    },
    {
      id: "battery",
      name: "Battery Health",
      description: "Evaluates the battery condition and charging capability",
      status: Math.random() > 0.8 ? "warning" : "passed",
      details:
        Math.random() > 0.8
          ? "Battery capacity is at 82% of original"
          : "Battery is in good condition",
      value: Math.random() > 0.8 ? 82 : 95,
    },
    {
      id: "firmware",
      name: "Firmware Check",
      description: "Verifies firmware integrity and version",
      status: "passed",
      details: "Firmware v2.0.3 is properly installed",
      value: 100,
    },
    {
      id: "surface",
      name: "Surface Calibration",
      description: "Tests tracking performance on current surface",
      status: Math.random() > 0.6 ? "warning" : "passed",
      details:
        Math.random() > 0.6
          ? "Surface calibration recommended for optimal performance"
          : "Surface calibration is optimal",
      value: Math.random() > 0.6 ? 70 : 90,
    },
    {
      id: "dpi",
      name: "DPI Accuracy",
      description: "Measures the accuracy of DPI settings",
      status: "passed",
      details: "DPI settings are accurate within 2% tolerance",
      value: 98,
    },
  ];
}

async function mockGetDeviceSpecs(): Promise<DeviceSpecs> {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    sensor: "HERO 25K",
    maxDPI: 25600,
    pollingRate: 1000,
    buttons: 11,
    connectivity: ["Wireless", "Bluetooth", "USB-C"],
    batteryLife: "Up to 60 hours",
    weight: "114g",
    dimensions: "132 x 75 x 40 mm",
  };
}

export default DeviceDiagnostics;
