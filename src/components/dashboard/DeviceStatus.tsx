import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMouseSettingsContext } from "@/context/MouseSettingsContext";
import { checkForFirmwareUpdates } from "@/lib/mouseData";
import {
  Usb,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface DeviceStatusProps {
  className?: string;
}

const DeviceStatus = ({ className }: DeviceStatusProps) => {
  const { connectedMouse, isLoading } = useMouseSettingsContext();
  const [firmwareUpdate, setFirmwareUpdate] = useState<{
    available: boolean;
    version: string;
  } | null>(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85); // Mock battery level

  useEffect(() => {
    // Check for firmware updates on initial load
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    setCheckingUpdate(true);
    try {
      const updateInfo = await checkForFirmwareUpdates();
      setFirmwareUpdate(updateInfo);
    } catch (error) {
      console.error("Failed to check for updates:", error);
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Usb className="h-5 w-5 text-primary" />
          Device Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2">Detecting device...</span>
            </div>
          ) : connectedMouse?.connected ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{connectedMouse.name}</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500"
                >
                  Connected
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Battery</span>
                  <span className="font-medium">{batteryLevel}%</span>
                </div>
                <Progress value={batteryLevel} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Firmware</span>
                  {firmwareUpdate?.available ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-500"
                    >
                      Update Available
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500"
                    >
                      Up to Date
                    </Badge>
                  )}
                </div>

                {firmwareUpdate?.available ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground">
                      New version {firmwareUpdate.version} is available
                    </div>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Update Firmware
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {firmwareUpdate?.version || "Current version"} installed
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div className="text-center">
                <p className="font-medium">No device detected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please connect your ProMouseTuner device
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={checkForUpdates}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;
