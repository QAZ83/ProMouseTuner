import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Bell, HelpCircle, Cog, Usb } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import UserProfileDropdown from "../auth/UserProfileDropdown";
import { useAuth } from "@/context/AuthContext";

interface DashboardHeaderProps {
  notificationCount?: number;
  deviceStatus?: "connected" | "disconnected" | "unknown";
  deviceName?: string;
  onSettingsClick?: () => void;
}

const DashboardHeader = ({
  notificationCount = 3,
  deviceStatus = "unknown",
  deviceName = "ProMouseTuner",
  onSettingsClick,
}: DashboardHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="w-full h-20 px-6 bg-background border-b border-border flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">ProMouseTuner</h1>
            {deviceStatus !== "unknown" && (
              <div className="flex items-center gap-1 text-xs">
                <Usb className="h-3 w-3" />
                <span>{deviceName}</span>
                {deviceStatus === "connected" ? (
                  <Badge
                    variant="outline"
                    className="h-4 py-0 text-[10px] bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="h-4 py-0 text-[10px] bg-red-500/10 text-red-500 border-red-500/20"
                  >
                    Disconnected
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={onSettingsClick}>
          <Cog className="h-5 w-5" />
        </Button>

        {/* Theme Switcher */}
        <ThemeSwitcher position="dropdown" size="sm" />

        {/* User Profile Dropdown */}
        <UserProfileDropdown onSettingsClick={onSettingsClick} />
      </div>
    </header>
  );
};

export default DashboardHeader;
