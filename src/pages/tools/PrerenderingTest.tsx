import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TestResult {
  check: string;
  status: "pass" | "fail" | "warning";
  details: string;
}

const PrerenderingTest = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState("");

  const runTest = async () => {
    if (!url) return;
    
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");
      const html = data.contents;

      const newResults: TestResult[] = [];

      // Check for basic HTML structure
      const hasDoctype = html.toLowerCase().includes("<!doctype html");
      newResults.push({
        check: "HTML Doctype",
        status: hasDoctype ? "pass" : "fail",
        details: hasDoctype ? "Valid HTML5 doctype found" : "Missing or invalid doctype"
      });

      // Check for title
      const title = doc.querySelector("title")?.textContent;
      newResults.push({
        check: "Title Tag",
        status: title ? "pass" : "fail",
        details: title ? `Title: "${title.slice(0, 60)}..."` : "No title tag found"
      });

      // Check for meta description
      const metaDesc = doc.querySelector('meta[name="description"]');
      newResults.push({
        check: "Meta Description",
        status: metaDesc ? "pass" : "warning",
        details: metaDesc ? "Meta description present" : "No meta description found"
      });

      // Check for rendered content (not just JS placeholders)
      const bodyText = doc.body?.textContent?.trim() || "";
      const hasContent = bodyText.length > 100;
      newResults.push({
        check: "Rendered Content",
        status: hasContent ? "pass" : "warning",
        details: hasContent 
          ? `${bodyText.length} characters of text content found` 
          : "Limited text content - may be JavaScript-rendered"
      });

      // Check for noscript fallback
      const hasNoscript = html.includes("<noscript");
      newResults.push({
        check: "Noscript Fallback",
        status: hasNoscript ? "pass" : "warning",
        details: hasNoscript 
          ? "Noscript tag present for JS-disabled users" 
          : "No noscript fallback - content may not be accessible without JS"
      });

      // Check for client-side rendering indicators
      const hasReactRoot = html.includes("__NEXT_DATA__") || html.includes("id=\"root\"") || html.includes("id=\"app\"");
      const hasSSRContent = !html.includes("Loading...") && bodyText.length > 500;
      newResults.push({
        check: "Pre-rendering Detection",
        status: hasSSRContent ? "pass" : hasReactRoot ? "warning" : "pass",
        details: hasReactRoot 
          ? (hasSSRContent ? "SPA detected with pre-rendered content" : "SPA detected - may rely on client-side rendering")
          : "Static or server-rendered content"
      });

      // Check for meta robots
      const metaRobots = doc.querySelector('meta[name="robots"]');
      const robotsContent = metaRobots?.getAttribute("content") || "";
      newResults.push({
        check: "Meta Robots",
        status: robotsContent.includes("noindex") ? "warning" : "pass",
        details: robotsContent 
          ? `Robots meta: ${robotsContent}` 
          : "No robots meta tag (defaults to index, follow)"
      });

      // Check canonical
      const canonical = doc.querySelector('link[rel="canonical"]');
      newResults.push({
        check: "Canonical URL",
        status: canonical ? "pass" : "warning",
        details: canonical 
          ? `Canonical: ${canonical.getAttribute("href")}` 
          : "No canonical URL specified"
      });

      // Check Open Graph
      const ogTitle = doc.querySelector('meta[property="og:title"]');
      newResults.push({
        check: "Open Graph Tags",
        status: ogTitle ? "pass" : "warning",
        details: ogTitle ? "Open Graph tags present" : "Missing Open Graph tags"
      });

      setResults(newResults);
    } catch (err) {
      setError("Failed to analyze the page. The URL might be blocked or invalid.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const passCount = results.filter(r => r.status === "pass").length;
  const failCount = results.filter(r => r.status === "fail").length;

  return (
    <ToolPageLayout
      title="Pre-rendering Testing Tool"
      description="Test if your JavaScript content is properly pre-rendered for SEO. Check if search engines can see your content."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Test URL for Pre-rendering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={runTest} disabled={loading || !url}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Test Results</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-green-500">{passCount} Passed</Badge>
                  {failCount > 0 && <Badge className="bg-red-500">{failCount} Failed</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    {getIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{result.check}</div>
                      <div className="text-xs text-muted-foreground">{result.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">About Pre-rendering</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Pre-rendering ensures that search engines can see your content without executing JavaScript. 
              This is crucial for SPAs (Single Page Applications) built with React, Vue, or Angular.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Server-Side Rendering (SSR) - Content rendered on each request</li>
              <li>• Static Site Generation (SSG) - Content pre-built at build time</li>
              <li>• Dynamic Rendering - Different content for bots vs users</li>
              <li>• Prerendering Services - Third-party solutions like Prerender.io</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default PrerenderingTest;
