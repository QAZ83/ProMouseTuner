import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DeviceDiagnostics from "./diagnostics/DeviceDiagnostics";
import FirmwareUpdatePanel from "./firmware/FirmwareUpdatePanel";
import SQLEditorPanel from "./sql/SQLEditorPanel";

interface DiagnosticsPanelProps {
  onBack?: () => void;
}

const DiagnosticsPanel = ({ onBack = () => {} }: DiagnosticsPanelProps) => {
  const [activeTab, setActiveTab] = useState("device");

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Diagnostics & Tools</h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="device">Device Diagnostics</TabsTrigger>
            <TabsTrigger value="firmware">Firmware Update</TabsTrigger>
            <TabsTrigger value="sql">SQL Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="device" className="mt-0">
            <Card className="p-0 overflow-hidden">
              <DeviceDiagnostics />
            </Card>
          </TabsContent>

          <TabsContent value="firmware" className="mt-0">
            <Card className="p-0 overflow-hidden">
              <FirmwareUpdatePanel />
            </Card>
          </TabsContent>

          <TabsContent value="sql" className="mt-0">
            <Card className="p-0 overflow-hidden">
              <SQLEditorPanel onBack={() => setActiveTab("device")} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiagnosticsPanel;
