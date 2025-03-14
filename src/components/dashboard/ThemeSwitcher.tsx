import React, { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

interface ThemeSwitcherProps {
  position?: "dropdown" | "buttons";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

const ThemeSwitcher = ({
  position = "dropdown",
  size = "md",
  showLabels = true,
  className = "",
}: ThemeSwitcherProps) => {
  // Use the theme context if available, otherwise use local state
  const themeContext = useTheme();
  const [localTheme, setLocalTheme] = useState<"light" | "dark" | "system">(
    "system",
  );

  // Determine whether to use context or local state
  const theme = themeContext?.theme || localTheme;
  const setTheme = themeContext?.setTheme || setLocalTheme;

  useEffect(() => {
    if (!themeContext) {
      // Only run this if we're not using the theme context
      // Check for system preference
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      // Get stored preference or use system
      const storedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | "system"
        | null;
      const initialTheme = storedTheme || "system";

      setLocalTheme(initialTheme);

      // Apply theme
      if (initialTheme === "system") {
        document.documentElement.classList.toggle(
          "dark",
          systemPreference === "dark",
        );
      } else {
        document.documentElement.classList.toggle(
          "dark",
          initialTheme === "dark",
        );
      }
    }
  }, [themeContext]);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);

    if (!themeContext) {
      // Only handle DOM updates if we're not using the theme context
      localStorage.setItem("theme", newTheme);

      // Apply theme
      if (newTheme === "system") {
        const systemPreference = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
          ? "dark"
          : "light";
        document.documentElement.classList.toggle(
          "dark",
          systemPreference === "dark",
        );
      } else {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      default:
        return "h-10 w-10";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "lg":
        return 24;
      default:
        return 20;
    }
  };

  if (position === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`${getButtonSize()} ${className}`}
          >
            {theme === "light" && <Sun size={getIconSize()} />}
            {theme === "dark" && <Moon size={getIconSize()} />}
            {theme === "system" && <Monitor size={getIconSize()} />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={theme === "light" ? "default" : "outline"}
        size={size}
        onClick={() => handleThemeChange("light")}
        className={`${!showLabels ? getButtonSize() : ""} ${!showLabels ? "p-0" : ""}`}
      >
        <Sun
          className={showLabels ? "mr-2 h-4 w-4" : ""}
          size={!showLabels ? getIconSize() : undefined}
        />
        {showLabels && <span>Light</span>}
      </Button>

      <Button
        variant={theme === "dark" ? "default" : "outline"}
        size={size}
        onClick={() => handleThemeChange("dark")}
        className={`${!showLabels ? getButtonSize() : ""} ${!showLabels ? "p-0" : ""}`}
      >
        <Moon
          className={showLabels ? "mr-2 h-4 w-4" : ""}
          size={!showLabels ? getIconSize() : undefined}
        />
        {showLabels && <span>Dark</span>}
      </Button>

      <Button
        variant={theme === "system" ? "default" : "outline"}
        size={size}
        onClick={() => handleThemeChange("system")}
        className={`${!showLabels ? getButtonSize() : ""} ${!showLabels ? "p-0" : ""}`}
      >
        <Monitor
          className={showLabels ? "mr-2 h-4 w-4" : ""}
          size={!showLabels ? getIconSize() : undefined}
        />
        {showLabels && <span>System</span>}
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
