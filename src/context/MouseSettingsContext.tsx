import React, { createContext, useContext, ReactNode } from "react";
import { useMouseSettings } from "@/hooks/useMouseSettings";
import {
  MouseSettings,
  GameProfile,
  Recommendation,
  CalibrationResults,
} from "@/lib/mouseData";

interface MouseSettingsContextType {
  settings: MouseSettings;
  profiles: GameProfile[];
  recommendations: Recommendation[];
  calibrationResults: CalibrationResults;
  connectedMouse: { name: string; connected: boolean } | null;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<MouseSettings>) => MouseSettings;
  updateProfile: (profile: GameProfile) => GameProfile[];
  deleteProfile: (id: string) => GameProfile[];
  dismissRecommendation: (id: string) => Recommendation[];
  applyRecommendation: (id: string) => {
    settings: MouseSettings;
    recommendations: Recommendation[];
  };
  saveCalibrationResults: (results: CalibrationResults) => CalibrationResults;
}

const MouseSettingsContext = createContext<
  MouseSettingsContextType | undefined
>(undefined);

export function MouseSettingsProvider({ children }: { children: ReactNode }) {
  const mouseSettings = useMouseSettings();

  const value: MouseSettingsContextType = {
    settings: mouseSettings.settings,
    profiles: mouseSettings.profiles,
    recommendations: mouseSettings.recommendations,
    calibrationResults: mouseSettings.calibrationResults,
    connectedMouse: mouseSettings.connectedMouse,
    isLoading: mouseSettings.isLoading,
    updateSettings: mouseSettings.updateSettings,
    updateProfile: mouseSettings.updateProfile,
    deleteProfile: mouseSettings.deleteProfile,
    dismissRecommendation: mouseSettings.dismissRec,
    applyRecommendation: mouseSettings.applyRec,
    saveCalibrationResults: mouseSettings.saveCalibration,
  };

  return (
    <MouseSettingsContext.Provider value={value}>
      {children}
    </MouseSettingsContext.Provider>
  );
}

export function useMouseSettingsContext() {
  const context = useContext(MouseSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useMouseSettingsContext must be used within a MouseSettingsProvider",
    );
  }
  return context;
}
