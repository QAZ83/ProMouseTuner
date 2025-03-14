import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SQLEditor from "./SQLEditor";

interface SQLEditorPanelProps {
  onBack?: () => void;
}

const SQLEditorPanel = ({ onBack = () => {} }: SQLEditorPanelProps) => {
  const [savedQueries, setSavedQueries] = useState<
    Array<{ name: string; query: string }>
  >([]);

  // Load saved queries from localStorage on mount
  useEffect(() => {
    const storedQueries = localStorage.getItem("mousetuner_saved_queries");
    if (storedQueries) {
      try {
        setSavedQueries(JSON.parse(storedQueries));
      } catch (error) {
        console.error("Error loading saved queries:", error);
      }
    }
  }, []);

  // Save queries to localStorage
  const handleSaveQuery = (name: string, query: string) => {
    const newSavedQueries = [...savedQueries, { name, query }];
    setSavedQueries(newSavedQueries);
    localStorage.setItem(
      "mousetuner_saved_queries",
      JSON.stringify(newSavedQueries),
    );
  };

  return (
    <div className="w-full h-full bg-background p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">SQL Editor</h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <SQLEditor
          onSaveQuery={handleSaveQuery}
          savedQueries={savedQueries}
          defaultQuery="-- Example queries:
-- SELECT * FROM profiles LIMIT 10;
-- SELECT id, username, email FROM profiles WHERE username LIKE '%user%';

-- Enter your SQL query here:
"
        />
      </div>
    </div>
  );
};

export default SQLEditorPanel;
