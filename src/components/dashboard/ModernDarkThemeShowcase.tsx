import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ThemeSwitcher from "./ThemeSwitcher";
import {
  Moon,
  Sun,
  Palette,
  Sparkles,
  Sliders,
  Laptop,
  Zap,
  Settings,
  ChevronRight,
} from "lucide-react";

const ModernDarkThemeShowcase = () => {
  return (
    <div className="w-full p-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Modern Dark Theme Design
          </h1>
          <p className="text-muted-foreground">
            Modern Dark Theme Design with Elegant UI
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <ThemeSwitcher position="buttons" showLabels={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border-primary/10">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Theme Controls
              </CardTitle>
              <CardDescription>
                Customize your interface appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-400" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch id="dark-mode" defaultChecked />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <Label htmlFor="contrast">Contrast</Label>
                  </div>
                  <Slider
                    id="contrast"
                    defaultValue={[75]}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-green-400" />
                    <Label htmlFor="accent-color">Accent Color</Label>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      "bg-blue-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-amber-500",
                      "bg-emerald-500",
                    ].map((color, i) => (
                      <div
                        key={i}
                        className={`${color} h-8 rounded-md cursor-pointer transition-all hover:scale-110 ${i === 0 ? "ring-2 ring-offset-2 ring-offset-background ring-blue-500" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 px-6 py-4">
              <Button variant="outline" className="mr-auto">
                Reset
              </Button>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-primary" />
                Display Options
              </CardTitle>
              <CardDescription>Configure your display settings</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="theme">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="theme">Theme</TabsTrigger>
                  <TabsTrigger value="text">Typography</TabsTrigger>
                  <TabsTrigger value="effects">Effects</TabsTrigger>
                </TabsList>

                <TabsContent value="theme" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="h-20 w-full bg-background border rounded-md flex items-center justify-center">
                        <Moon className="h-8 w-8 text-blue-400" />
                      </div>
                      <span className="font-medium">Dark</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="h-20 w-full bg-white border rounded-md flex items-center justify-center">
                        <Sun className="h-8 w-8 text-amber-400" />
                      </div>
                      <span className="font-medium">Light</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Slider
                      id="font-size"
                      defaultValue={[16]}
                      min={12}
                      max={24}
                      step={1}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="effects" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations">Animations</Label>
                    <Switch id="animations" defaultChecked />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Theme Showcase</CardTitle>
            <CardDescription>
              Preview of UI elements with the current theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>

                <h3 className="text-lg font-medium pt-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Form Elements</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <Switch id="marketing" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline">Cancel</Button>
            <Button className="gap-1">
              Apply Theme <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>Powered by ProMouseTuner Modern UI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDarkThemeShowcase;
