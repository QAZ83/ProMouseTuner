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
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  HardDrive,
} from "lucide-react";

interface FirmwareVersion {
  version: string;
  releaseDate: string;
  description: string;
  size: string;
  status: "current" | "available" | "older";
}

interface FirmwareUpdatePanelProps {
  deviceName?: string;
  currentVersion?: string;
  onCheckForUpdates?: () => Promise<FirmwareVersion[]>;
  onUpdateFirmware?: (version: string) => Promise<boolean>;
}

const FirmwareUpdatePanel = ({
  deviceName = "ProMouseTuner G502",
  currentVersion = "v2.0.3",
  onCheckForUpdates = mockCheckForUpdates,
  onUpdateFirmware = mockUpdateFirmware,
}: FirmwareUpdatePanelProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [firmwareVersions, setFirmwareVersions] = useState<FirmwareVersion[]>(
    [],
  );
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    // Check for updates on initial load
    handleCheckForUpdates();
  }, []);

  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    setError(null);
    setSuccess(null);

    try {
      const versions = await onCheckForUpdates();
      setFirmwareVersions(versions);

      // Set active tab based on available updates
      const hasUpdates = versions.some((v) => v.status === "available");
      setActiveTab(hasUpdates ? "available" : "current");

      setSuccess(
        hasUpdates
          ? "New firmware update available!"
          : "Your firmware is up to date",
      );
    } catch (err) {
      setError("Failed to check for updates");
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpdateFirmware = async (version: string) => {
    setIsUpdating(true);
    setUpdateProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUpdateProgress((prev) => {
          const next = prev + Math.random() * 10;
          return next > 95 ? 95 : next;
        });
      }, 500);

      const result = await onUpdateFirmware(version);
      clearInterval(progressInterval);

      if (result) {
        setUpdateProgress(100);
        setSuccess(`Successfully updated firmware to ${version}`);

        // Update the firmware versions list
        setFirmwareVersions((prev) =>
          prev.map((v) => ({
            ...v,
            status:
              v.version === version
                ? "current"
                : v.status === "current"
                  ? "older"
                  : v.status,
          })),
        );

        // Switch to current tab
        setActiveTab("current");
      } else {
        setError("Firmware update failed");
      }
    } catch (err) {
      setError("Firmware update failed");
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Current
          </Badge>
        );
      case "available":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Available
          </Badge>
        );
      case "older":
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
            Older
          </Badge>
        );
      default:
        return null;
    }
  };

  const availableUpdates = firmwareVersions.filter(
    (v) => v.status === "available",
  );
  const currentVersionInfo = firmwareVersions.find(
    (v) => v.status === "current",
  );
  const olderVersions = firmwareVersions.filter((v) => v.status === "older");

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              Firmware Update
            </CardTitle>
            <CardDescription>
              Keep your {deviceName} up to date with the latest firmware
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCheckForUpdates}
            disabled={isChecking || isUpdating}
          >
            {isChecking ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Check for Updates
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
            className={
              success.includes("up to date")
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }
          >
            <AlertDescription
              className={
                success.includes("up to date")
                  ? "text-green-800"
                  : "text-blue-800"
              }
            >
              {success}
            </AlertDescription>
          </Alert>
        )}

        {isUpdating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Updating firmware...</span>
              <span>{Math.round(updateProgress)}%</span>
            </div>
            <Progress value={updateProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Please do not disconnect your device during the update process.
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="available"
              disabled={availableUpdates.length === 0}
            >
              Available
              {availableUpdates.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {availableUpdates.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="history" disabled={olderVersions.length === 0}>
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 pt-4">
            {availableUpdates.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">No updates available</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your device is running the latest firmware version.
                </p>
              </div>
            ) : (
              availableUpdates.map((version) => (
                <div
                  key={version.version}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{version.version}</h3>
                        {getStatusBadge(version.status)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{version.releaseDate}</span>
                        <span className="mx-1">•</span>
                        <FileText className="h-3 w-3" />
                        <span>{version.size}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateFirmware(version.version)}
                      disabled={isUpdating || isChecking}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Update
                    </Button>
                  </div>
                  <p className="text-sm">{version.description}</p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="current" className="pt-4">
            {currentVersionInfo ? (
              <div className="border rounded-lg p-4 space-y-3 bg-green-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {currentVersionInfo.version}
                      </h3>
                      {getStatusBadge(currentVersionInfo.status)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{currentVersionInfo.releaseDate}</span>
                      <span className="mx-1">•</span>
                      <FileText className="h-3 w-3" />
                      <span>{currentVersionInfo.size}</span>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm">{currentVersionInfo.description}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium">
                  No current version detected
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please check your device connection and try again.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 pt-4">
            {olderVersions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No version history</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Previous firmware versions will appear here.
                </p>
              </div>
            ) : (
              olderVersions.map((version) => (
                <div
                  key={version.version}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{version.version}</h3>
                        {getStatusBadge(version.status)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{version.releaseDate}</span>
                        <span className="mx-1">•</span>
                        <FileText className="h-3 w-3" />
                        <span>{version.size}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{version.description}</p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Firmware updates may reset your device settings. We recommend
            exporting your settings before updating.
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Mock functions for demonstration
async function mockCheckForUpdates(): Promise<FirmwareVersion[]> {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      version: "v2.1.4",
      releaseDate: "2023-06-15",
      description:
        "Improved tracking accuracy on various surfaces and fixed DPI fluctuation issues.",
      size: "3.2 MB",
      status: "available",
    },
    {
      version: "v2.0.3",
      releaseDate: "2023-03-22",
      description:
        "Current firmware version with enhanced power management and button response time.",
      size: "2.8 MB",
      status: "current",
    },
    {
      version: "v1.9.7",
      releaseDate: "2022-11-10",
      description:
        "Added support for surface calibration and improved wireless connectivity.",
      size: "2.5 MB",
      status: "older",
    },
    {
      version: "v1.8.2",
      releaseDate: "2022-07-05",
      description:
        "Fixed issues with sleep mode and added new RGB lighting effects.",
      size: "2.3 MB",
      status: "older",
    },
  ];
}

async function mockUpdateFirmware(version: string): Promise<boolean> {
  // Simulate network request and firmware update process
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 90% success rate for demonstration
  return Math.random() > 0.1;
}

export default FirmwareUpdatePanel;
