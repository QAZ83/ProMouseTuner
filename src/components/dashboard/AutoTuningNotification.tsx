import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from "../ui/toast";
import { BellRing, Check, X, Settings, Info, Zap } from "lucide-react";

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  game?: string;
}

interface AutoTuningNotificationProps {
  suggestions?: OptimizationSuggestion[];
  isOpen?: boolean;
  onApply?: (suggestionId: string) => void;
  onDismiss?: (suggestionId: string) => void;
  onViewAll?: () => void;
}

const AutoTuningNotification = ({
  suggestions = [
    {
      id: "1",
      title: "Reduce DPI for Better Precision",
      description:
        "Lowering your DPI from 1600 to 800 could improve your accuracy in FPS games.",
      impact: "high",
      game: "Counter-Strike 2",
    },
    {
      id: "2",
      title: "Adjust Polling Rate",
      description: "Increasing polling rate to 1000Hz will reduce input lag.",
      impact: "medium",
    },
    {
      id: "3",
      title: "Optimize Lift-off Distance",
      description:
        "Your current lift-off distance is too high for your play style.",
      impact: "low",
      game: "Valorant",
    },
  ],
  isOpen = true,
  onApply = () => {},
  onDismiss = () => {},
  onViewAll = () => {},
}: AutoTuningNotificationProps) => {
  const [activeSuggestion, setActiveSuggestion] = useState<string>(
    suggestions[0]?.id || "",
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
  });

  if (!isOpen || suggestions.length === 0) return null;

  const currentSuggestion =
    suggestions.find((s) => s.id === activeSuggestion) || suggestions[0];

  const handleApply = (id: string) => {
    onApply(id);
    setToastMessage({
      title: "Optimization Applied",
      description: `The ${currentSuggestion.title.toLowerCase()} optimization has been applied.`,
    });
    setShowToast(true);

    // Move to next suggestion if available
    const currentIndex = suggestions.findIndex((s) => s.id === id);
    if (currentIndex < suggestions.length - 1) {
      setActiveSuggestion(suggestions[currentIndex + 1].id);
    } else if (suggestions.length > 1) {
      setActiveSuggestion(suggestions[0].id);
    }
  };

  const handleDismiss = (id: string) => {
    onDismiss(id);

    // Move to next suggestion if available
    const currentIndex = suggestions.findIndex((s) => s.id === id);
    if (currentIndex < suggestions.length - 1) {
      setActiveSuggestion(suggestions[currentIndex + 1].id);
    } else if (suggestions.length > 1) {
      setActiveSuggestion(suggestions[0].id);
    }
  };

  const getImpactColor = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background">
      <ToastProvider>
        {showToast && (
          <Toast className="bg-green-50 border-green-200">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <div className="grid gap-1">
                <ToastTitle>{toastMessage.title}</ToastTitle>
                <ToastDescription>{toastMessage.description}</ToastDescription>
              </div>
            </div>
            <ToastClose onClick={() => setShowToast(false)} />
          </Toast>
        )}

        <Card className="w-[400px] shadow-lg border-primary/20">
          <CardHeader className="pb-2 bg-primary/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Smart Auto-Tuning</CardTitle>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Personalized optimization suggestions based on your usage
                      patterns
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription className="text-xs">
              {suggestions.length} optimization{" "}
              {suggestions.length === 1 ? "suggestion" : "suggestions"}{" "}
              available
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Zap
                    className={`h-5 w-5 ${getImpactColor(currentSuggestion.impact)}`}
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">
                    {currentSuggestion.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {currentSuggestion.description}
                  </p>
                  {currentSuggestion.game && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                        {currentSuggestion.game}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">Impact:</span>
                  <span
                    className={`text-xs font-medium ${getImpactColor(currentSuggestion.impact)}`}
                  >
                    {currentSuggestion.impact.charAt(0).toUpperCase() +
                      currentSuggestion.impact.slice(1)}
                  </span>
                </div>

                {suggestions.length > 1 && (
                  <div className="flex items-center gap-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        className={`h-1.5 w-1.5 rounded-full ${suggestion.id === activeSuggestion ? "bg-primary" : "bg-gray-300"}`}
                        onClick={() => setActiveSuggestion(suggestion.id)}
                        aria-label={`View suggestion ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDismiss(currentSuggestion.id)}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Dismiss
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onViewAll}
                className="text-xs"
              >
                <Settings className="h-3 w-3 mr-1" />
                View All
              </Button>
              <Button
                size="sm"
                onClick={() => handleApply(currentSuggestion.id)}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Apply
              </Button>
            </div>
          </CardFooter>
        </Card>
      </ToastProvider>
    </div>
  );
};

export default AutoTuningNotification;
