import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Zap, Gamepad2, Save } from "lucide-react";

interface SettingsTabsProps {
  defaultTab?: string;
}

const SettingsTabs = ({ defaultTab = "basic" }: SettingsTabsProps) => {
  return (
    <div className="w-full bg-background p-4 rounded-lg">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full flex justify-start mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Basic Settings
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Advanced Settings
          </TabsTrigger>
          <TabsTrigger
            value="game-profiles"
            className="flex items-center gap-2"
          >
            <Gamepad2 className="h-4 w-4" />
            Game-Specific Profiles
          </TabsTrigger>
        </TabsList>

        {/* Basic Settings Tab Content */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Mouse Settings</CardTitle>
              <CardDescription>
                Configure the fundamental settings for your mouse performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="sensitivity">Sensitivity</Label>
                    <span className="text-sm text-muted-foreground">
                      800 DPI
                    </span>
                  </div>
                  <Slider
                    id="sensitivity"
                    defaultValue={[800]}
                    max={3200}
                    min={400}
                    step={100}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="polling-rate">Polling Rate</Label>
                    <span className="text-sm text-muted-foreground">
                      1000 Hz
                    </span>
                  </div>
                  <Slider
                    id="polling-rate"
                    defaultValue={[1000]}
                    max={2000}
                    min={125}
                    step={125}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="acceleration" className="flex-1">
                    Mouse Acceleration
                  </Label>
                  <Switch id="acceleration" />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="smoothing" className="flex-1">
                    Mouse Smoothing
                  </Label>
                  <Switch id="smoothing" />
                </div>
              </div>

              <Button className="w-full mt-4 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Basic Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings Tab Content */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Mouse Settings</CardTitle>
              <CardDescription>
                Fine-tune your mouse with advanced configuration options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lift-off-distance">
                    Lift-off Distance (mm)
                  </Label>
                  <Slider
                    id="lift-off-distance"
                    defaultValue={[2]}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="angle-snapping">Angle Snapping</Label>
                  <Slider
                    id="angle-snapping"
                    defaultValue={[0]}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debounce-time">Debounce Time (ms)</Label>
                  <Input id="debounce-time" type="number" defaultValue="8" />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="raw-input" className="flex-1">
                    Raw Input
                  </Label>
                  <Switch id="raw-input" defaultChecked />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="surface-calibration" className="flex-1">
                    Surface Calibration
                  </Label>
                  <Switch id="surface-calibration" />
                </div>
              </div>

              <Button className="w-full mt-4 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Game Profiles Tab Content */}
        <TabsContent value="game-profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Game-Specific Profiles</CardTitle>
              <CardDescription>
                Create and manage custom mouse profiles for different games.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select a game to configure or create a new profile.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Counter-Strike 2",
                    image:
                      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80",
                  },
                  {
                    name: "Valorant",
                    image:
                      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80",
                  },
                  {
                    name: "Apex Legends",
                    image:
                      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80",
                  },
                  {
                    name: "Fortnite",
                    image:
                      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80",
                  },
                  { name: "+ Add New Profile", image: "" },
                ].map((game, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${game.name === "+ Add New Profile" ? "border-dashed flex items-center justify-center h-[120px]" : "relative overflow-hidden h-[120px]"}`}
                  >
                    {game.name !== "+ Add New Profile" ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                        <img
                          src={game.image}
                          alt={game.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2 z-20">
                          <h3 className="text-white font-medium">
                            {game.name}
                          </h3>
                          <p className="text-xs text-white/80">
                            Custom profile
                          </p>
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground font-medium">
                        {game.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTabs;
