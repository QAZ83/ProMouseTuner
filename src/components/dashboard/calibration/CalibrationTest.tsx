import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, MousePointer, Zap, Check, X, RefreshCw } from "lucide-react";

type TestType = "accuracy" | "speed" | "tracking";

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  hit: boolean;
}

interface CalibrationTestProps {
  onComplete?: (results: TestResults) => void;
  testType?: TestType;
  difficulty?: "easy" | "medium" | "hard";
}

interface TestResults {
  accuracy: number;
  speed: number;
  tracking: number;
  overall: number;
}

const CalibrationTest = ({
  onComplete = () => {},
  testType = "accuracy",
  difficulty = "medium",
}: CalibrationTestProps) => {
  const [currentTest, setCurrentTest] = useState<TestType>(testType);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<TestResults>({
    accuracy: 0,
    speed: 0,
    tracking: 0,
    overall: 0,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([]);

  const testAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Test configuration based on difficulty
  const config = {
    easy: {
      targetCount: 5,
      targetSize: 50,
      testDuration: 30,
    },
    medium: {
      targetCount: 10,
      targetSize: 40,
      testDuration: 30,
    },
    hard: {
      targetCount: 15,
      targetSize: 30,
      testDuration: 30,
    },
  }[difficulty];

  // Initialize test
  const startTest = () => {
    setIsRunning(true);
    setProgress(0);
    setTimeLeft(config.testDuration);
    setScore(0);

    if (currentTest === "accuracy" || currentTest === "speed") {
      generateTargets();
    } else if (currentTest === "tracking") {
      setPathPoints([]);
      startTrackingPath();
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        setProgress(
          ((config.testDuration - newTime) / config.testDuration) * 100,
        );

        if (newTime <= 0) {
          completeTest();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  // Generate random targets for accuracy and speed tests
  const generateTargets = () => {
    if (!testAreaRef.current) return;

    const { width, height } = testAreaRef.current.getBoundingClientRect();
    const newTargets: Target[] = [];

    for (let i = 0; i < config.targetCount; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * (width - config.targetSize),
        y: Math.random() * (height - config.targetSize),
        size: config.targetSize,
        hit: false,
      });
    }

    setTargets(newTargets);
  };

  // Generate path for tracking test
  const startTrackingPath = () => {
    if (!testAreaRef.current) return;

    const { width, height } = testAreaRef.current.getBoundingClientRect();
    const pathPoint = {
      x: Math.random() * (width - 50),
      y: Math.random() * (height - 50),
    };

    setPathPoints([pathPoint]);

    // Generate new path point every second
    const pathInterval = setInterval(() => {
      if (!isRunning) {
        clearInterval(pathInterval);
        return;
      }

      const newPoint = {
        x: Math.random() * (width - 50),
        y: Math.random() * (height - 50),
      };

      setPathPoints((prev) => [...prev, newPoint]);
    }, 1500);

    return () => clearInterval(pathInterval);
  };

  // Handle target click for accuracy and speed tests
  const handleTargetClick = (id: number) => {
    if (!isRunning) return;

    setTargets((prev) =>
      prev.map((target) =>
        target.id === id ? { ...target, hit: true } : target,
      ),
    );

    setScore((prev) => prev + 1);

    // Check if all targets are hit
    const allHit = targets.every((target) => target.id === id || target.hit);
    if (allHit && targets.length > 0) {
      generateTargets(); // Generate new targets
    }
  };

  // Track mouse movement for tracking test
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRunning || currentTest !== "tracking" || !testAreaRef.current)
      return;

    const rect = testAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    // Calculate distance to current path point
    if (pathPoints.length > 0) {
      const currentPoint = pathPoints[pathPoints.length - 1];
      const distance = Math.sqrt(
        Math.pow(currentPoint.x - x, 2) + Math.pow(currentPoint.y - y, 2),
      );

      // Update tracking score based on proximity to path
      if (distance < 50) {
        setScore((prev) => prev + 0.1); // Small increment for staying on path
      }
    }
  };

  // Complete the current test
  const completeTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRunning(false);

    // Calculate test results
    let testScore = 0;

    if (currentTest === "accuracy") {
      const hitTargets = targets.filter((t) => t.hit).length;
      testScore = (hitTargets / (targets.length + score - hitTargets)) * 100;
    } else if (currentTest === "speed") {
      testScore = (score / config.testDuration) * 100;
    } else if (currentTest === "tracking") {
      testScore = (score / config.testDuration) * 20; // Normalize tracking score
    }

    // Ensure score is within 0-100 range
    testScore = Math.min(100, Math.max(0, testScore));

    // Round to nearest integer
    testScore = Math.round(testScore);

    // Update results
    setResults((prev) => {
      const newResults = {
        ...prev,
        [currentTest]: testScore,
      };

      // Calculate overall score if all tests are completed
      const { accuracy, speed, tracking } = newResults;
      if (accuracy > 0 && speed > 0 && tracking > 0) {
        newResults.overall = Math.round((accuracy + speed + tracking) / 3);
      }

      // Call onComplete callback with results
      onComplete(newResults);

      return newResults;
    });
  };

  // Change test type
  const changeTest = (type: TestType) => {
    setCurrentTest(type);
    setIsRunning(false);
    setProgress(0);
    setTimeLeft(config.testDuration);
    setScore(0);
    setTargets([]);
    setPathPoints([]);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Mouse Calibration Test</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={currentTest === "accuracy" ? "default" : "outline"}
              onClick={() => changeTest("accuracy")}
              className="flex items-center gap-2"
            >
              <Target size={16} /> Accuracy
            </Button>
            <Button
              variant={currentTest === "speed" ? "default" : "outline"}
              onClick={() => changeTest("speed")}
              className="flex items-center gap-2"
            >
              <Zap size={16} /> Speed
            </Button>
            <Button
              variant={currentTest === "tracking" ? "default" : "outline"}
              onClick={() => changeTest("tracking")}
              className="flex items-center gap-2"
            >
              <MousePointer size={16} /> Tracking
            </Button>
          </div>
        </div>
        <CardDescription>
          {currentTest === "accuracy" &&
            "Click on the targets as accurately as possible."}
          {currentTest === "speed" &&
            "Click on as many targets as you can within the time limit."}
          {currentTest === "tracking" &&
            "Follow the moving target with your cursor as closely as possible."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">Time Left:</span> {timeLeft}s
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Score:</span>{" "}
            {Math.round(score * 10) / 10}
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        <div
          ref={testAreaRef}
          className="relative w-full h-[400px] border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50"
          onMouseMove={handleMouseMove}
        >
          {!isRunning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5">
              <h3 className="text-xl font-semibold mb-4">
                {results[currentTest] > 0 ? (
                  <span className="flex items-center gap-2">
                    <Check className="text-green-500" /> Test Completed
                  </span>
                ) : (
                  "Ready to Start"
                )}
              </h3>

              {results[currentTest] > 0 && (
                <div className="mb-4 text-center">
                  <p className="text-lg">
                    Your {currentTest} score:{" "}
                    <span className="font-bold">
                      {Math.round(results[currentTest])}
                    </span>
                  </p>
                  {results.overall > 0 && (
                    <p className="text-sm text-gray-500">
                      Overall calibration: {Math.round(results.overall)}%
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={startTest}
                size="lg"
                className="flex items-center gap-2"
              >
                {results[currentTest] > 0 ? (
                  <>
                    <RefreshCw size={16} /> Retry Test
                  </>
                ) : (
                  "Start Test"
                )}
              </Button>
            </div>
          )}

          {isRunning && currentTest === "tracking" && pathPoints.length > 0 && (
            <>
              {/* Path visualization */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d={`M ${pathPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
                {pathPoints.map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={i === pathPoints.length - 1 ? "#3b82f6" : "#93c5fd"}
                  />
                ))}
              </svg>

              {/* Current target */}
              <div
                className="absolute w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{
                  left: pathPoints[pathPoints.length - 1].x,
                  top: pathPoints[pathPoints.length - 1].y,
                }}
              >
                <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
              </div>

              {/* Mouse cursor visualization */}
              <div
                className="absolute w-6 h-6 border-2 border-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: mousePosition.x, top: mousePosition.y }}
              ></div>
            </>
          )}

          {isRunning &&
            (currentTest === "accuracy" || currentTest === "speed") && (
              <>
                {targets.map((target) => (
                  <button
                    key={target.id}
                    className={`absolute rounded-full flex items-center justify-center transition-all ${target.hit ? "bg-green-200 cursor-default" : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
                    style={{
                      left: target.x,
                      top: target.y,
                      width: target.size,
                      height: target.size,
                      transform: target.hit ? "scale(0.8)" : "scale(1)",
                    }}
                    onClick={() => !target.hit && handleTargetClick(target.id)}
                    disabled={target.hit}
                  >
                    {target.hit ? (
                      <Check size={20} className="text-green-700" />
                    ) : null}
                  </button>
                ))}
              </>
            )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (isRunning) {
              completeTest();
            } else {
              changeTest(currentTest);
            }
          }}
        >
          {isRunning ? (
            <X size={16} className="mr-2" />
          ) : (
            <RefreshCw size={16} className="mr-2" />
          )}
          {isRunning ? "Cancel Test" : "Reset"}
        </Button>

        {!isRunning && results.overall > 0 && (
          <div className="text-sm text-gray-500">
            All tests completed. Overall calibration score:{" "}
            {Math.round(results.overall)}%
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CalibrationTest;
