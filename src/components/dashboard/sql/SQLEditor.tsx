import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Database, Play, Save, FileDown, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SQLEditorProps {
  defaultQuery?: string;
  onSaveQuery?: (name: string, query: string) => void;
  savedQueries?: Array<{ name: string; query: string }>;
}

const SQLEditor = ({
  defaultQuery = "SELECT * FROM profiles LIMIT 10;",
  onSaveQuery = () => {},
  savedQueries = [],
}: SQLEditorProps) => {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [copied, setCopied] = useState(false);

  const executeQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a SQL query");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized");
      }

      const { data, error } = await supabase.rpc("execute_sql", {
        sql_query: query,
      });

      if (error) throw error;

      setResults(data || []);
      setActiveTab("results");
    } catch (err: any) {
      setError(err.message || "An error occurred while executing the query");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveQuery = () => {
    const name = prompt("Enter a name for this query:");
    if (name) {
      onSaveQuery(name, query);
    }
  };

  const handleLoadQuery = (savedQuery: string) => {
    setQuery(savedQuery);
  };

  const downloadResults = () => {
    if (!results) return;

    const csv = [
      // Headers
      Object.keys(results[0] || {}).join(","),
      // Data rows
      ...results.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query_results_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full h-full bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          SQL Editor
        </CardTitle>
        <CardDescription>
          Execute SQL queries against your Supabase database
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="editor">Query Editor</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="saved">Saved Queries</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0">
          <TabsContent value="editor" className="p-6 pt-2">
            <div className="space-y-4">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
                className="font-mono min-h-[300px] resize-none"
              />

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveQuery}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Query
                  </Button>
                </div>
                <Button
                  onClick={executeQuery}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isLoading ? "Executing..." : "Execute Query"}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="p-6 pt-2">
            <div className="space-y-4">
              {results && results.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      {results.length} {results.length === 1 ? "row" : "rows"}{" "}
                      returned
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResults}
                      className="flex items-center gap-2"
                    >
                      <FileDown className="h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>

                  <div className="border rounded-md overflow-auto max-h-[400px]">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(results[0] || {}).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-2 text-left font-medium text-muted-foreground"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row, i) => (
                          <tr
                            key={i}
                            className={
                              i % 2 === 0 ? "bg-background" : "bg-muted/30"
                            }
                          >
                            {Object.values(row).map((value: any, j) => (
                              <td key={j} className="px-4 py-2 border-t">
                                {value === null ? (
                                  <span className="text-muted-foreground italic">
                                    null
                                  </span>
                                ) : typeof value === "object" ? (
                                  JSON.stringify(value)
                                ) : (
                                  String(value)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : results && results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    Query executed successfully, but no results were returned.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Execute a query to see results here.</p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="p-6 pt-2">
            {savedQueries.length > 0 ? (
              <div className="space-y-4">
                {savedQueries.map((saved, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleLoadQuery(saved.query)}
                  >
                    <h3 className="font-medium">{saved.name}</h3>
                    <pre className="mt-2 text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                      {saved.query}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved queries yet.</p>
                <p className="text-sm mt-2">
                  Save your queries for quick access in the future.
                </p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="border-t p-6 text-sm text-muted-foreground">
        <p>
          Note: This SQL editor executes queries against your Supabase database.
          Use with caution as changes made are permanent.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SQLEditor;
