import { MouseSettings, GameProfile, CalibrationResults } from "./mouseData";

// Keys for localStorage
const STORAGE_KEYS = {
  SETTINGS: "mousetuner_settings",
  PROFILES: "mousetuner_profiles",
  CALIBRATION: "mousetuner_calibration",
  THEME: "mousetuner_theme",
  USER_ID: "mousetuner_user_id",
};

// Storage interface
export interface Storage {
  saveSettings(settings: MouseSettings, userId?: string): Promise<void>;
  loadSettings(userId?: string): Promise<MouseSettings | null>;
  saveProfiles(profiles: GameProfile[], userId?: string): Promise<void>;
  loadProfiles(userId?: string): Promise<GameProfile[] | null>;
  saveCalibrationResults(
    results: CalibrationResults,
    userId?: string,
  ): Promise<void>;
  loadCalibrationResults(userId?: string): Promise<CalibrationResults | null>;
  exportData(userId?: string): Promise<string>;
  importData(data: string, userId?: string): Promise<boolean>;
  clearData(userId?: string): Promise<void>;
}

// Local storage implementation
export const localStorageProvider: Storage = {
  async saveSettings(settings: MouseSettings, userId?: string): Promise<void> {
    const key = userId
      ? `${STORAGE_KEYS.SETTINGS}_${userId}`
      : STORAGE_KEYS.SETTINGS;
    localStorage.setItem(key, JSON.stringify(settings));
  },

  async loadSettings(userId?: string): Promise<MouseSettings | null> {
    const key = userId
      ? `${STORAGE_KEYS.SETTINGS}_${userId}`
      : STORAGE_KEYS.SETTINGS;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  async saveProfiles(profiles: GameProfile[], userId?: string): Promise<void> {
    const key = userId
      ? `${STORAGE_KEYS.PROFILES}_${userId}`
      : STORAGE_KEYS.PROFILES;
    localStorage.setItem(key, JSON.stringify(profiles));
  },

  async loadProfiles(userId?: string): Promise<GameProfile[] | null> {
    const key = userId
      ? `${STORAGE_KEYS.PROFILES}_${userId}`
      : STORAGE_KEYS.PROFILES;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  async saveCalibrationResults(
    results: CalibrationResults,
    userId?: string,
  ): Promise<void> {
    const key = userId
      ? `${STORAGE_KEYS.CALIBRATION}_${userId}`
      : STORAGE_KEYS.CALIBRATION;
    localStorage.setItem(key, JSON.stringify(results));
  },

  async loadCalibrationResults(
    userId?: string,
  ): Promise<CalibrationResults | null> {
    const key = userId
      ? `${STORAGE_KEYS.CALIBRATION}_${userId}`
      : STORAGE_KEYS.CALIBRATION;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  async exportData(userId?: string): Promise<string> {
    const settings = await this.loadSettings(userId);
    const profiles = await this.loadProfiles(userId);
    const calibration = await this.loadCalibrationResults(userId);

    const exportData = {
      settings,
      profiles,
      calibration,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    return JSON.stringify(exportData);
  },

  async importData(data: string, userId?: string): Promise<boolean> {
    try {
      const parsedData = JSON.parse(data);

      // Validate data structure
      if (!parsedData.version || !parsedData.exportDate) {
        throw new Error("Invalid export data format");
      }

      // Import settings if available
      if (parsedData.settings) {
        await this.saveSettings(parsedData.settings, userId);
      }

      // Import profiles if available
      if (parsedData.profiles) {
        await this.saveProfiles(parsedData.profiles, userId);
      }

      // Import calibration results if available
      if (parsedData.calibration) {
        await this.saveCalibrationResults(parsedData.calibration, userId);
      }

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  },

  async clearData(userId?: string): Promise<void> {
    if (userId) {
      localStorage.removeItem(`${STORAGE_KEYS.SETTINGS}_${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.PROFILES}_${userId}`);
      localStorage.removeItem(`${STORAGE_KEYS.CALIBRATION}_${userId}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.PROFILES);
      localStorage.removeItem(STORAGE_KEYS.CALIBRATION);
    }
  },
};

// Supabase storage implementation (would be implemented when Supabase is connected)
export const supabaseStorageProvider: Storage = {
  // These would be implemented to use Supabase tables
  // For now, they just delegate to localStorage
  async saveSettings(settings: MouseSettings, userId?: string): Promise<void> {
    return localStorageProvider.saveSettings(settings, userId);
  },

  async loadSettings(userId?: string): Promise<MouseSettings | null> {
    return localStorageProvider.loadSettings(userId);
  },

  async saveProfiles(profiles: GameProfile[], userId?: string): Promise<void> {
    return localStorageProvider.saveProfiles(profiles, userId);
  },

  async loadProfiles(userId?: string): Promise<GameProfile[] | null> {
    return localStorageProvider.loadProfiles(userId);
  },

  async saveCalibrationResults(
    results: CalibrationResults,
    userId?: string,
  ): Promise<void> {
    return localStorageProvider.saveCalibrationResults(results, userId);
  },

  async loadCalibrationResults(
    userId?: string,
  ): Promise<CalibrationResults | null> {
    return localStorageProvider.loadCalibrationResults(userId);
  },

  async exportData(userId?: string): Promise<string> {
    return localStorageProvider.exportData(userId);
  },

  async importData(data: string, userId?: string): Promise<boolean> {
    return localStorageProvider.importData(data, userId);
  },

  async clearData(userId?: string): Promise<void> {
    return localStorageProvider.clearData(userId);
  },
};

// Export the appropriate storage provider
export const storage = localStorageProvider;
