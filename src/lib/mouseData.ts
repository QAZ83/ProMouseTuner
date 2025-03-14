// This file contains utilities for accessing and manipulating mouse data

// Types for mouse data
export interface MouseSettings {
  dpi: number;
  pollingRate: number;
  acceleration: boolean;
  smoothing: boolean;
  liftOffDistance: number;
  angleSnapping: number;
  debounceTime: number;
  rawInput: boolean;
  surfaceCalibration: boolean;
}

export interface CalibrationResults {
  accuracy: number;
  speed: number;
  tracking: number;
  overall: number;
}

export interface GameProfile {
  id: string;
  name: string;
  icon: string;
  dpi: number;
  pollingRate: number;
  liftOffDistance: number;
  angleSnapping: boolean;
  acceleration: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: "sensitivity" | "acceleration" | "polling" | "other";
  game?: string;
}

// Mock data - in a real app, this would come from device drivers or APIs
const defaultMouseSettings: MouseSettings = {
  dpi: 800,
  pollingRate: 1000,
  acceleration: false,
  smoothing: false,
  liftOffDistance: 2,
  angleSnapping: 0,
  debounceTime: 8,
  rawInput: true,
  surfaceCalibration: false,
};

const defaultProfiles: GameProfile[] = [
  {
    id: "1",
    name: "FPS Games",
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=fps",
    dpi: 800,
    pollingRate: 1000,
    liftOffDistance: 2,
    angleSnapping: false,
    acceleration: false,
  },
  {
    id: "2",
    name: "MOBA Games",
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=moba",
    dpi: 1200,
    pollingRate: 500,
    liftOffDistance: 1,
    angleSnapping: true,
    acceleration: false,
  },
  {
    id: "3",
    name: "RTS Games",
    icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=rts",
    dpi: 1600,
    pollingRate: 250,
    liftOffDistance: 1,
    angleSnapping: true,
    acceleration: true,
  },
];

const defaultRecommendations: Recommendation[] = [
  {
    id: "rec1",
    title: "Reduce Sensitivity",
    description:
      "Lower your sensitivity by 10% to improve precision in FPS games",
    impact: "high",
    type: "sensitivity",
    game: "Counter-Strike 2",
  },
  {
    id: "rec2",
    title: "Increase Polling Rate",
    description: "Increase polling rate to 1000Hz for smoother tracking",
    impact: "medium",
    type: "polling",
  },
  {
    id: "rec3",
    title: "Disable Acceleration",
    description: "Turn off mouse acceleration for more consistent movements",
    impact: "high",
    type: "acceleration",
    game: "Valorant",
  },
];

// Simulated local storage
let currentSettings: MouseSettings = { ...defaultMouseSettings };
let currentProfiles: GameProfile[] = [...defaultProfiles];
let currentRecommendations: Recommendation[] = [...defaultRecommendations];
let currentCalibrationResults: CalibrationResults = {
  accuracy: 0,
  speed: 0,
  tracking: 0,
  overall: 0,
};

// API functions
export const getMouseSettings = (): MouseSettings => {
  return { ...currentSettings };
};

export const updateMouseSettings = (
  settings: Partial<MouseSettings>,
): MouseSettings => {
  currentSettings = { ...currentSettings, ...settings };
  return currentSettings;
};

export const getGameProfiles = (): GameProfile[] => {
  return [...currentProfiles];
};

export const getGameProfile = (id: string): GameProfile | undefined => {
  return currentProfiles.find((profile) => profile.id === id);
};

export const updateGameProfile = (profile: GameProfile): GameProfile[] => {
  const index = currentProfiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    currentProfiles[index] = profile;
  } else {
    currentProfiles.push(profile);
  }
  return [...currentProfiles];
};

export const deleteGameProfile = (id: string): GameProfile[] => {
  currentProfiles = currentProfiles.filter((profile) => profile.id !== id);
  return [...currentProfiles];
};

export const getRecommendations = (): Recommendation[] => {
  return [...currentRecommendations];
};

export const dismissRecommendation = (id: string): Recommendation[] => {
  currentRecommendations = currentRecommendations.filter(
    (rec) => rec.id !== id,
  );
  return [...currentRecommendations];
};

export const applyRecommendation = (
  id: string,
): { settings: MouseSettings; recommendations: Recommendation[] } => {
  const recommendation = currentRecommendations.find((rec) => rec.id === id);

  if (recommendation) {
    // Apply the recommendation to settings
    switch (recommendation.type) {
      case "sensitivity":
        currentSettings.dpi = Math.round(currentSettings.dpi * 0.9); // Reduce by 10%
        break;
      case "polling":
        currentSettings.pollingRate = 1000;
        break;
      case "acceleration":
        currentSettings.acceleration = false;
        break;
      // Add more cases as needed
    }

    // Remove the recommendation after applying
    currentRecommendations = currentRecommendations.filter(
      (rec) => rec.id !== id,
    );
  }

  return {
    settings: { ...currentSettings },
    recommendations: [...currentRecommendations],
  };
};

export const saveCalibrationResults = (
  results: CalibrationResults,
): CalibrationResults => {
  currentCalibrationResults = { ...results };

  // Generate new recommendations based on results
  if (results.accuracy < 70) {
    currentRecommendations.push({
      id: `rec${Date.now()}`,
      title: "Lower DPI for Better Accuracy",
      description:
        "Your accuracy test shows you might benefit from a lower DPI setting",
      impact: "high",
      type: "sensitivity",
    });
  }

  if (results.speed < 70) {
    currentRecommendations.push({
      id: `rec${Date.now() + 1}`,
      title: "Increase Polling Rate",
      description: "Your speed test indicates a higher polling rate could help",
      impact: "medium",
      type: "polling",
    });
  }

  return currentCalibrationResults;
};

export const getCalibrationResults = (): CalibrationResults => {
  return { ...currentCalibrationResults };
};

// Simulated device detection
export const detectConnectedMouse = (): Promise<{
  name: string;
  connected: boolean;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "ProMouseTuner G502",
        connected: true,
      });
    }, 1000);
  });
};

// Simulated firmware update check
export const checkForFirmwareUpdates = (): Promise<{
  available: boolean;
  version: string;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        available: Math.random() > 0.7, // 30% chance of update being available
        version: "v2.1.4",
      });
    }, 1500);
  });
};
