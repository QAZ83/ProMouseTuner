import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardTabs from "./dashboard/DashboardTabs";
import CalibrationPanel from "./dashboard/CalibrationPanel";
import SettingsPanel from "./dashboard/SettingsPanel";
import PerformancePanel from "./dashboard/PerformancePanel";
import TroubleshootingPanel from "./dashboard/TroubleshootingPanel";
import DiagnosticsPanel from "./dashboard/DiagnosticsPanel";
import AutoTuningNotification from "./dashboard/AutoTuningNotification";
import { useMouseSettingsContext } from "@/context/MouseSettingsContext";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const [activeTab, setActiveTab] = useState("calibration");
  const [showAutoTuning, setShowAutoTuning] = useState(true);

  const {
    recommendations,
    dismissRecommendation,
    applyRecommendation,
    connectedMouse,
  } = useMouseSettingsContext();

  const { user } = useAuth();

  // Update notification visibility when recommendations change
  useEffect(() => {
    setShowAutoTuning(recommendations.length > 0);
  }, [recommendations]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    applyRecommendation(suggestionId);
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    dismissRecommendation(suggestionId);
  };

  const handleViewAllSuggestions = () => {
    // Switch to settings tab to view all suggestions
    setActiveTab("settings");
  };

  const handleSettingsClick = () => {
    setActiveTab("settings");
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case "calibration":
        return (
          <CalibrationPanel onSettingsApply={() => setActiveTab("settings")} />
        );
      case "settings":
        return <SettingsPanel onBack={() => setActiveTab("calibration")} />;
      case "performance":
        return <PerformancePanel />;
      case "troubleshooting":
        return <TroubleshootingPanel />;
      case "diagnostics":
        return <DiagnosticsPanel onBack={() => setActiveTab("calibration")} />;
      default:
        return <CalibrationPanel />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader
        notificationCount={recommendations.length}
        deviceStatus={connectedMouse?.connected ? "connected" : "disconnected"}
        deviceName={connectedMouse?.name}
        onSettingsClick={handleSettingsClick}
      />
      <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="flex-1 overflow-auto">{renderActivePanel()}</main>

      {showAutoTuning && recommendations.length > 0 && (
        <AutoTuningNotification
          suggestions={recommendations}
          isOpen={showAutoTuning}
          onApply={handleApplySuggestion}
          onDismiss={handleDismissSuggestion}
          onViewAll={handleViewAllSuggestions}
        />
      )}
    </div>
  );
};

export default Home;
