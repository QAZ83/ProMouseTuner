import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge, Settings, Activity, HelpCircle, Cpu } from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <div className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="h-14 bg-transparent justify-start w-full">
            <TabsTrigger
              value="calibration"
              className="data-[state=active]:bg-muted flex items-center gap-2 h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Gauge className="h-4 w-4" />
              <span>Calibration</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-muted flex items-center gap-2 h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Activity className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-muted flex items-center gap-2 h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger
              value="troubleshooting"
              className="data-[state=active]:bg-muted flex items-center gap-2 h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Troubleshooting</span>
            </TabsTrigger>
            <TabsTrigger
              value="diagnostics"
              className="data-[state=active]:bg-muted flex items-center gap-2 h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Cpu className="h-4 w-4" />
              <span>Diagnostics</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardTabs;
