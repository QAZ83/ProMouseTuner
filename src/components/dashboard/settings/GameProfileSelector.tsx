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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Gamepad, Plus, Save, Trash2 } from "lucide-react";

interface GameProfile {
  id: string;
  name: string;
  icon: string;
  dpi: number;
  pollingRate: number;
  liftOffDistance: number;
  angleSnapping: boolean;
  acceleration: boolean;
}

interface GameProfileSelectorProps {
  profiles?: GameProfile[];
  onSelectProfile?: (profileId: string) => void;
  onSaveProfile?: (profile: GameProfile) => void;
  onDeleteProfile?: (profileId: string) => void;
  onCreateProfile?: () => void;
}

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

const GameProfileSelector = ({
  profiles = defaultProfiles,
  onSelectProfile = () => {},
  onSaveProfile = () => {},
  onDeleteProfile = () => {},
  onCreateProfile = () => {},
}: GameProfileSelectorProps) => {
  const [selectedProfileId, setSelectedProfileId] = useState(
    profiles[0]?.id || "",
  );
  const [editedProfile, setEditedProfile] = useState<GameProfile | null>(null);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId);
    onSelectProfile(profileId);
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      setEditedProfile({ ...profile });
    }
  };

  const handleProfileChange = (field: keyof GameProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  const handleSaveProfile = () => {
    if (editedProfile) {
      onSaveProfile(editedProfile);
    }
  };

  const handleDeleteProfile = () => {
    if (selectedProfileId) {
      onDeleteProfile(selectedProfileId);
      if (profiles.length > 1) {
        const newSelectedId =
          profiles.find((p) => p.id !== selectedProfileId)?.id || "";
        setSelectedProfileId(newSelectedId);
      } else {
        setSelectedProfileId("");
        setEditedProfile(null);
      }
    }
  };

  // Initialize editedProfile if not set and profiles exist
  React.useEffect(() => {
    if (!editedProfile && profiles.length > 0) {
      setEditedProfile({ ...profiles[0] });
      setSelectedProfileId(profiles[0].id);
    }
  }, [profiles, editedProfile]);

  return (
    <Card className="w-full bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Game Profiles</span>
          <Button variant="outline" size="sm" onClick={onCreateProfile}>
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </Button>
        </CardTitle>
        <CardDescription>
          Configure mouse settings for specific games or game types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={selectedProfileId}
          onValueChange={handleProfileSelect}
          value={selectedProfileId}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            {profiles.map((profile) => (
              <TabsTrigger
                key={profile.id}
                value={profile.id}
                className="flex items-center"
              >
                <img
                  src={profile.icon}
                  alt={profile.name}
                  className="w-6 h-6 mr-2 rounded-full"
                />
                {profile.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {profiles.map((profile) => (
            <TabsContent
              key={profile.id}
              value={profile.id}
              className="space-y-4"
            >
              {editedProfile && editedProfile.id === profile.id && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <Gamepad className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <Label htmlFor="profile-name">Profile Name</Label>
                        <Input
                          id="profile-name"
                          value={editedProfile.name}
                          onChange={(e) =>
                            handleProfileChange("name", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dpi-slider">
                          DPI: {editedProfile.dpi}
                        </Label>
                        <Slider
                          id="dpi-slider"
                          min={400}
                          max={3200}
                          step={100}
                          value={[editedProfile.dpi]}
                          onValueChange={(value) =>
                            handleProfileChange("dpi", value[0])
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="polling-rate-slider">
                          Polling Rate: {editedProfile.pollingRate}Hz
                        </Label>
                        <Slider
                          id="polling-rate-slider"
                          min={125}
                          max={1000}
                          step={125}
                          value={[editedProfile.pollingRate]}
                          onValueChange={(value) =>
                            handleProfileChange("pollingRate", value[0])
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="lift-off-distance-slider">
                          Lift-off Distance: {editedProfile.liftOffDistance}mm
                        </Label>
                        <Slider
                          id="lift-off-distance-slider"
                          min={1}
                          max={5}
                          step={1}
                          value={[editedProfile.liftOffDistance]}
                          onValueChange={(value) =>
                            handleProfileChange("liftOffDistance", value[0])
                          }
                          className="mt-2"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="angle-snapping-switch">
                          Angle Snapping
                        </Label>
                        <Switch
                          id="angle-snapping-switch"
                          checked={editedProfile.angleSnapping}
                          onCheckedChange={(checked) =>
                            handleProfileChange("angleSnapping", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="acceleration-switch">
                          Acceleration
                        </Label>
                        <Switch
                          id="acceleration-switch"
                          checked={editedProfile.acceleration}
                          onCheckedChange={(checked) =>
                            handleProfileChange("acceleration", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="destructive" onClick={handleDeleteProfile}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Profile
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GameProfileSelector;
