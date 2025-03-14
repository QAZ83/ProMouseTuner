import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import { Download, Upload, Copy, Check, RefreshCw } from "lucide-react";

interface ImportExportSettingsProps {
  onImportComplete?: () => void;
}

const ImportExportSettings = ({
  onImportComplete,
}: ImportExportSettingsProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("export");
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await storage.exportData(user?.id);
      setExportData(data);
      setSuccess("Settings exported successfully");
    } catch (err) {
      setError("Failed to export settings");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!importData.trim()) {
        setError("Please enter valid JSON data");
        return;
      }

      const result = await storage.importData(importData, user?.id);
      if (result) {
        setSuccess("Settings imported successfully");
        setImportData("");
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        setError("Failed to import settings. Invalid data format.");
      }
    } catch (err) {
      setError("Failed to import settings");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mousetuner_settings_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export Settings</CardTitle>
        <CardDescription>
          Backup your settings or transfer them to another device
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button
                onClick={handleExport}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export Settings
              </Button>

              {exportData && (
                <div className="space-y-4 mt-4">
                  <Textarea
                    value={exportData}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCopyToClipboard}
                      className="flex-1"
                    >
                      {copied ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleDownloadFile}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Settings File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />

                <div className="text-center text-sm text-muted-foreground">
                  or paste JSON data below
                </div>

                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your exported settings JSON here..."
                  rows={8}
                  className="font-mono text-xs"
                />

                <Button
                  onClick={handleImport}
                  disabled={isLoading || !importData.trim()}
                >
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Import Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImportExportSettings;
