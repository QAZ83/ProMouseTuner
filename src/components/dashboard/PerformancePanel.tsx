import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sliders, RefreshCw, Save } from "lucide-react";
import PerformanceCharts from "./performance/PerformanceCharts";
import RecommendationsPanel from "./performance/RecommendationsPanel";
import GameComparisonChart from "./performance/GameComparisonChart";
import PerformanceHistory from "./performance/PerformanceHistory";
import DeviceStatus from "./DeviceStatus";
import { useMouseSettingsContext } from "@/context/MouseSettingsContext";

interface PerformancePanelProps {
  activeGame?: string;
  onRefreshData?: () => void;
  onSaveConfiguration?: () => void;
  onCustomizeView?: () => void;
}

const PerformancePanel = ({
  activeGame = "All Games",
  onRefreshData = () => {},
  onSaveConfiguration = () => {},
  onCustomizeView = () => {},
}: PerformancePanelProps) => {
  const [activeTab, setActiveTab] = useState("charts");
  const { recommendations, dismissRecommendation, applyRecommendation } =
    useMouseSettingsContext();

  // Functions for chart interactions
  const handleChartTypeChange = (chartId: string, type: string) => {
    console.log(`Changed chart ${chartId} to type ${type}`);
  };

  const handleTimeRangeChange = (range: string) => {
    console.log(`Changed time range to ${range}`);
  };

  const handleExportData = () => {
    console.log("Exporting data...");
  };

  const handleShareChart = () => {
    console.log("Sharing chart...");
  };

  const handleCustomizeDisplay = () => {
    onCustomizeView();
  };

  // Functions for recommendations
  const handleApplyRecommendation = (id: string) => {
    applyRecommendation(id);
  };

  const handleDismissRecommendation = (id: string) => {
    dismissRecommendation(id);
  };

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Performance Tracking</h2>
            <p className="text-muted-foreground">
              Monitor and optimize your mouse performance for {activeGame}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline" onClick={onSaveConfiguration}>
              <Save className="h-4 w-4 mr-2" />
              Save Config
            </Button>
            <Button variant="outline" onClick={onCustomizeView}>
              <Sliders className="h-4 w-4 mr-2" />
              Customize View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-0 overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b px-6 py-2">
                  <TabsList>
                    <TabsTrigger value="charts">Performance Charts</TabsTrigger>
                    <TabsTrigger value="recommendations">
                      Recommendations
                    </TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="comparison">
                      Game Comparison
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="charts" className="p-0 m-0">
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3">
                      <PerformanceCharts
                        onChartTypeChange={handleChartTypeChange}
                        onTimeRangeChange={handleTimeRangeChange}
                        onExportData={handleExportData}
                        onShareChart={handleShareChart}
                        onCustomizeDisplay={handleCustomizeDisplay}
                      />
                    </div>
                    <div className="xl:col-span-1">
                      <RecommendationsPanel
                        recommendations={recommendations}
                        onApply={handleApplyRecommendation}
                        onDismiss={handleDismissRecommendation}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-semibold mb-4">
                        All Recommendations
                      </h3>
                      <RecommendationsPanel
                        recommendations={recommendations}
                        onApply={handleApplyRecommendation}
                        onDismiss={handleDismissRecommendation}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-semibold">
                      Performance History
                    </h3>
                    <p className="text-muted-foreground">
                      View your performance trends over time
                    </p>

                    <PerformanceHistory />
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="p-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-semibold">Game Comparison</h3>
                    <p className="text-muted-foreground">
                      Compare your mouse performance across different games
                    </p>

                    <GameComparisonChart />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <DeviceStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePanel;
