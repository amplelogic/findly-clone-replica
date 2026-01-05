import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Link } from "lucide-react";

const CanonicalUrlChecker = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{
    hasCanonical: boolean;
    canonicalUrl: string;
    isSelfReferencing: boolean;
    issues: string[];
  } | null>(null);

  const checkCanonical = () => {
    if (!url) return;
    
    // Simulated check - in production, this would make an actual request
    const simulatedCanonical = url.includes("?") ? url.split("?")[0] : url;
    const isSelf = simulatedCanonical === url;
    
    setResult({
      hasCanonical: true,
      canonicalUrl: simulatedCanonical,
      isSelfReferencing: isSelf,
      issues: isSelf ? [] : ["Canonical URL differs from page URL"]
    });
  };

  return (
    <ToolPageLayout
      title="Canonical URL Checker"
      description="Verify that canonical tags are properly implemented across your pages to avoid duplicate content issues."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              Check URL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Page URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                type="url"
              />
            </div>
            <Button onClick={checkCanonical} className="w-full">
              Check Canonical Tag
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium">Results</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                {result.hasCanonical ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {result.hasCanonical ? "Canonical tag found" : "No canonical tag found"}
                </span>
              </div>
              
              {result.hasCanonical && (
                <>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Canonical URL</Label>
                    <code className="block p-3 bg-muted rounded-lg text-sm break-all">
                      {result.canonicalUrl}
                    </code>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={result.isSelfReferencing ? "default" : "secondary"}>
                      {result.isSelfReferencing ? "Self-referencing" : "Points to different URL"}
                    </Badge>
                  </div>
                  
                  {result.issues.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Issues</Label>
                      {result.issues.map((issue, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default CanonicalUrlChecker;
