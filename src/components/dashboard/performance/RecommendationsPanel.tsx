import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  X,
  Zap,
  MousePointer,
  Gauge,
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: "sensitivity" | "acceleration" | "polling" | "other";
}

interface RecommendationsPanelProps {
  recommendations?: Recommendation[];
  onApply?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const RecommendationsPanel = ({
  recommendations = [
    {
      id: "rec1",
      title: "Reduce Sensitivity",
      description:
        "Lower your sensitivity by 10% to improve precision in FPS games",
      impact: "high",
      type: "sensitivity",
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
    },
  ],
  onApply = () => {},
  onDismiss = () => {},
}: RecommendationsPanelProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-slate-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sensitivity":
        return <MousePointer className="h-4 w-4" />;
      case "acceleration":
        return <Zap className="h-4 w-4" />;
      case "polling":
        return <Gauge className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full h-full bg-white overflow-auto">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Optimization Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recommendations at this time.</p>
            <p className="text-sm mt-2">
              Complete more tests to generate personalized optimizations.
            </p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="border rounded-lg p-4 bg-slate-50 relative"
            >
              <div className="absolute top-3 right-3 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onDismiss(rec.id)}
                  title="Dismiss"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white p-2 rounded-full border">
                  {getTypeIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium flex items-center gap-2">
                    {rec.title}
                    <span className={`text-xs ${getImpactColor(rec.impact)}`}>
                      {rec.impact.toUpperCase()} IMPACT
                    </span>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.description}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => onApply(rec.id)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDismiss(rec.id)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm">
          View All Recommendations
        </Button>
        <Button size="sm">Apply All</Button>
      </CardFooter>
    </Card>
  );
};

export default RecommendationsPanel;
