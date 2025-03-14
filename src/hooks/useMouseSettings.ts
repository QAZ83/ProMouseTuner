import { useState, useEffect } from "react";
import {
  MouseSettings,
  GameProfile,
  Recommendation,
  CalibrationResults,
  getMouseSettings,
  updateMouseSettings,
  getGameProfiles,
  updateGameProfile,
  deleteGameProfile,
  getRecommendations,
  dismissRecommendation,
  applyRecommendation,
  saveCalibrationResults,
  getCalibrationResults,
  detectConnectedMouse,
} from "@/lib/mouseData";

export function useMouseSettings() {
  const [settings, setSettings] = useState<MouseSettings>(getMouseSettings());
  const [profiles, setProfiles] = useState<GameProfile[]>(getGameProfiles());
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>(getRecommendations());
  const [calibrationResults, setCalibrationResults] =
    useState<CalibrationResults>(getCalibrationResults());
  const [connectedMouse, setConnectedMouse] = useState<{
    name: string;
    connected: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Detect connected mouse on initial load
  useEffect(() => {
    const detectMouse = async () => {
      setIsLoading(true);
      try {
        const mouseInfo = await detectConnectedMouse();
        setConnectedMouse(mouseInfo);
      } catch (error) {
        console.error("Failed to detect mouse:", error);
      } finally {
        setIsLoading(false);
      }
    };

    detectMouse();
  }, []);

  // Update settings
  const updateSettings = (newSettings: Partial<MouseSettings>) => {
    const updated = updateMouseSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  // Update game profile
  const updateProfile = (profile: GameProfile) => {
    const updatedProfiles = updateGameProfile(profile);
    setProfiles(updatedProfiles);
    return updatedProfiles;
  };

  // Delete game profile
  const deleteProfile = (id: string) => {
    const updatedProfiles = deleteGameProfile(id);
    setProfiles(updatedProfiles);
    return updatedProfiles;
  };

  // Dismiss recommendation
  const dismissRec = (id: string) => {
    const updatedRecs = dismissRecommendation(id);
    setRecommendations(updatedRecs);
    return updatedRecs;
  };

  // Apply recommendation
  const applyRec = (id: string) => {
    const result = applyRecommendation(id);
    setSettings(result.settings);
    setRecommendations(result.recommendations);
    return result;
  };

  // Save calibration results
  const saveCalibration = (results: CalibrationResults) => {
    const savedResults = saveCalibrationResults(results);
    setCalibrationResults(savedResults);
    // Update recommendations after calibration
    setRecommendations(getRecommendations());
    return savedResults;
  };

  return {
    settings,
    profiles,
    recommendations,
    calibrationResults,
    connectedMouse,
    isLoading,
    updateSettings,
    updateProfile,
    deleteProfile,
    dismissRec,
    applyRec,
    saveCalibration,
  };
}
