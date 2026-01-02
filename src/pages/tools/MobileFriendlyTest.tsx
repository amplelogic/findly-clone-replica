import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, XCircle, AlertCircle, Smartphone } from "lucide-react";

interface TestResult {
  url: string;
  status: "pass" | "fail" | "warning" | "pending" | "error";
  issues: string[];
  hasViewport: boolean;
  hasResponsiveImages: boolean;
  touchTargets: boolean;
  fontSize: boolean;
}

const MobileFriendlyTest = () => {
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);

  const runBulkTest = async () => {
    const urlList = urls.split("\n").filter(u => u.trim());
    if (urlList.length === 0) return;
    
    setLoading(true);
    setResults([]);
    setProgress(0);

    const newResults: TestResult[] = [];

    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i].trim();
      setProgress(((i + 1) / urlList.length) * 100);

      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");
        const html = data.contents.toLowerCase();
        
        const issues: string[] = [];

        // Check viewport
        const hasViewport = !!doc.querySelector('meta[name="viewport"]');
        if (!hasViewport) {
          issues.push("Missing viewport meta tag");
        }

        // Check for responsive images
        const images = doc.querySelectorAll("img");
        const responsiveImages = Array.from(images).filter(img => 
          img.getAttribute("srcset") || 
          img.style.maxWidth === "100%" ||
          html.includes("max-width: 100%") ||
          html.includes("max-width:100%")
        );
        const hasResponsiveImages = images.length === 0 || responsiveImages.length > 0;
        if (!hasResponsiveImages && images.length > 0) {
          issues.push("Images may not be responsive");
        }

        // Check for touch target sizes (simplified check)
        const links = doc.querySelectorAll("a");
        const buttons = doc.querySelectorAll("button");
        const touchTargets = links.length > 0 || buttons.length > 0;
        
        // Check font sizes
        const hasSmallFonts = html.includes("font-size: 8px") || 
                             html.includes("font-size: 9px") || 
                             html.includes("font-size: 10px") ||
                             html.includes("font-size:8px") ||
                             html.includes("font-size:9px") ||
                             html.includes("font-size:10px");
        const fontSize = !hasSmallFonts;
        if (hasSmallFonts) {
          issues.push("Small font sizes detected");
        }

        // Check for horizontal scrolling issues
        const hasFixedWidth = html.includes("width: 980px") || 
                             html.includes("width: 1024px") ||
                             html.includes("width:980px") ||
                             html.includes("width:1024px");
        if (hasFixedWidth) {
          issues.push("Fixed width elements may cause horizontal scrolling");
        }

        // Check for Flash content
        const hasFlash = html.includes("<embed") || html.includes("<object");
        if (hasFlash) {
          issues.push("Flash or plugin content detected");
        }

        const status = issues.length === 0 ? "pass" : issues.length <= 2 ? "warning" : "fail";

        newResults.push({
          url,
          status,
          issues,
          hasViewport,
          hasResponsiveImages,
          touchTargets,
          fontSize
        });
      } catch (err) {
        newResults.push({
          url,
          status: "error",
          issues: ["Failed to fetch URL"],
          hasViewport: false,
          hasResponsiveImages: false,
          touchTargets: false,
          fontSize: false
        });
      }

      setResults([...newResults]);
    }

    setLoading(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-500">Mobile Friendly</Badge>;
      case "fail":
        return <Badge className="bg-red-500">Not Mobile Friendly</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Issues Found</Badge>;
      case "error":
        return <Badge variant="secondary">Error</Badge>;
      default:
        return <Badge variant="secondary">Testing...</Badge>;
    }
  };

  const passCount = results.filter(r => r.status === "pass").length;
  const failCount = results.filter(r => r.status === "fail" || r.status === "error").length;

  return (
    <ToolPageLayout
      title="Mobile-Friendly Test (Bulk)"
      description="Test multiple URLs for mobile-friendliness at once. Check viewport, responsive design, and more."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter URLs to Test (one per line)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="https://example.com&#10;https://example.com/page1&#10;https://example.com/page2"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {urls.split("\n").filter(u => u.trim()).length} URLs
              </span>
              <Button onClick={runBulkTest} disabled={loading || !urls.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Run Bulk Test
                  </>
                )}
              </Button>
            </div>
            {loading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Testing... {Math.round(progress)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {results.length > 0 && (
          <>
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-green-500">{passCount}</div>
                  <p className="text-sm text-muted-foreground">Passed</p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-red-500">{failCount}</div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {results.map((result, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(result.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">{result.url}</span>
                            {getStatusBadge(result.status)}
                          </div>
                          {result.issues.length > 0 && (
                            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                              {result.issues.map((issue, j) => (
                                <li key={j}>• {issue}</li>
                              ))}
                            </ul>
                          )}
                          {result.status === "pass" && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">Viewport ✓</Badge>
                              <Badge variant="outline" className="text-xs">Responsive Images ✓</Badge>
                              <Badge variant="outline" className="text-xs">Font Size ✓</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default MobileFriendlyTest;
