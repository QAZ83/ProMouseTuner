import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, BookOpen, MessageSquare } from "lucide-react";
import KnowledgeBase from "./troubleshooting/KnowledgeBase";
import ContactSupport from "./troubleshooting/ContactSupport";

interface TroubleshootingPanelProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TroubleshootingPanel = ({
  activeTab = "knowledge-base",
  onTabChange = () => {},
}: TroubleshootingPanelProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    onTabChange(value);
  };

  return (
    <div className="w-full h-full bg-background p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Troubleshooting & Support</h1>
            <p className="text-muted-foreground mt-1">
              Find solutions to common issues or contact our support team for
              assistance
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            <span>Need help? Check our shortcuts reference below</span>
          </div>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="knowledge-base"
              className="flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Knowledge Base</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact-support"
              className="flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact Support</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge-base">
            <KnowledgeBase />
          </TabsContent>

          <TabsContent value="contact-support">
            <ContactSupport />
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Shortcuts Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Calibration</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Start New Calibration</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+N
                    </kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Reset Current Test</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+R
                    </kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Skip Current Test</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+S
                    </kbd>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Settings</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Save Profile</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+S
                    </kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Create New Profile</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+P
                    </kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Reset to Defaults</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+D
                    </kbd>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">General</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Toggle Dark Mode</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+T
                    </kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Open Settings</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      Ctrl+,
                    </kbd>
                  </li>
                  <li className="flex justify-between">
                    <span>Help</span>
                    <kbd className="px-2 py-0.5 bg-background rounded text-xs">
                      F1
                    </kbd>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TroubleshootingPanel;
