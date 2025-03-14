import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsTabs from "./settings/SettingsTabs";
import GameProfileSelector from "./settings/GameProfileSelector";
import { ArrowLeft, Save } from "lucide-react";

interface SettingsPanelProps {
  onBack?: () => void;
  activeTab?: string;
  onSaveSettings?: (settings: any) => void;
}

const SettingsPanel = ({
  onBack = () => {},
  activeTab = "general",
  onSaveSettings = () => {},
}: SettingsPanelProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      theme: "system",
      notifications: true,
      autoUpdate: true,
    },
    mouse: {
      sensitivity: 800,
      pollingRate: 1000,
      acceleration: false,
      smoothing: false,
    },
    advanced: {
      liftOffDistance: 2,
      angleSnapping: 0,
      debounceTime: 8,
      rawInput: true,
      surfaceCalibration: false,
    },
  });

  const handleSettingsChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    onSaveSettings(settings);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        {hasUnsavedChanges && (
          <Button
            onClick={handleSaveSettings}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="mouse">Mouse Settings</TabsTrigger>
          <TabsTrigger value="profiles">Game Profiles</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure application-wide settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                General application settings will be displayed here. This
                includes theme preferences, notification settings, and
                auto-update options.
              </p>
              {/* General settings content would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mouse">
          <SettingsTabs defaultTab="basic" />
        </TabsContent>

        <TabsContent value="profiles">
          <GameProfileSelector
            onSaveProfile={(profile) => {
              setHasUnsavedChanges(true);
              // Handle profile saving logic
            }}
            onCreateProfile={() => {
              setHasUnsavedChanges(true);
              // Handle profile creation logic
            }}
            onDeleteProfile={(profileId) => {
              setHasUnsavedChanges(true);
              // Handle profile deletion logic
            }}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced system settings and optimizations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                These settings are for advanced users. Changing these settings
                may affect system performance and stability.
              </p>
              {/* Advanced settings content would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
