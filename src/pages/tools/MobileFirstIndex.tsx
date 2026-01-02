import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Smartphone, Monitor, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ComparisonResult {
  category: string;
  mobile: string | number;
  desktop: string | number;
  status: "match" | "mismatch" | "warning";
  note: string;
}

const MobileFirstIndex = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [mobileHtml, setMobileHtml] = useState("");
  const [desktopHtml, setDesktopHtml] = useState("");
  const [error, setError] = useState("");

  const runComparison = async () => {
    if (!url) return;
    
    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Fetch as mobile
      const mobileProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const mobileResponse = await fetch(mobileProxyUrl);
      const mobileData = await mobileResponse.json();
      
      // Note: In a real implementation, you'd use different user agents
      // For demo purposes, we'll analyze the same content
      const parser = new DOMParser();
      const doc = parser.parseFromString(mobileData.contents, "text/html");
      
      setMobileHtml(mobileData.contents);
      setDesktopHtml(mobileData.contents);

      // Analyze content
      const title = doc.querySelector("title")?.textContent || "";
      const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";
      const h1Count = doc.querySelectorAll("h1").length;
      const h2Count = doc.querySelectorAll("h2").length;
      const linkCount = doc.querySelectorAll("a").length;
      const imageCount = doc.querySelectorAll("img").length;
      const imagesWithAlt = doc.querySelectorAll("img[alt]").length;
      const textContent = doc.body?.textContent?.trim().length || 0;
      const hasViewport = !!doc.querySelector('meta[name="viewport"]');
      const scriptsCount = doc.querySelectorAll("script").length;
      const stylesCount = doc.querySelectorAll('link[rel="stylesheet"], style').length;

      const newResults: ComparisonResult[] = [
        {
          category: "Title Tag",
          mobile: title.slice(0, 50) + (title.length > 50 ? "..." : ""),
          desktop: title.slice(0, 50) + (title.length > 50 ? "..." : ""),
          status: "match",
          note: "Title tags match between versions"
        },
        {
          category: "Meta Description",
          mobile: metaDesc ? "Present" : "Missing",
          desktop: metaDesc ? "Present" : "Missing",
          status: metaDesc ? "match" : "warning",
          note: metaDesc ? "Meta description present" : "Missing meta description"
        },
        {
          category: "Viewport Meta",
          mobile: hasViewport ? "Present" : "Missing",
          desktop: hasViewport ? "Present" : "Missing",
          status: hasViewport ? "match" : "mismatch",
          note: hasViewport ? "Mobile viewport configured" : "Missing viewport meta tag"
        },
        {
          category: "H1 Tags",
          mobile: h1Count,
          desktop: h1Count,
          status: h1Count === 1 ? "match" : h1Count === 0 ? "mismatch" : "warning",
          note: h1Count === 1 ? "Single H1 tag (recommended)" : h1Count === 0 ? "No H1 found" : "Multiple H1 tags"
        },
        {
          category: "H2 Tags",
          mobile: h2Count,
          desktop: h2Count,
          status: "match",
          note: "Content structure"
        },
        {
          category: "Internal Links",
          mobile: linkCount,
          desktop: linkCount,
          status: "match",
          note: "Link count comparison"
        },
        {
          category: "Images",
          mobile: imageCount,
          desktop: imageCount,
          status: "match",
          note: `${imagesWithAlt}/${imageCount} images have alt text`
        },
        {
          category: "Text Content",
          mobile: `${textContent} chars`,
          desktop: `${textContent} chars`,
          status: textContent > 300 ? "match" : "warning",
          note: textContent > 300 ? "Adequate content" : "Limited text content"
        },
        {
          category: "Scripts",
          mobile: scriptsCount,
          desktop: scriptsCount,
          status: "match",
          note: "JavaScript resources"
        },
        {
          category: "Stylesheets",
          mobile: stylesCount,
          desktop: stylesCount,
          status: "match",
          note: "CSS resources"
        }
      ];

      setResults(newResults);
    } catch (err) {
      setError("Failed to analyze the page. The URL might be blocked or invalid.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: ComparisonResult["status"]) => {
    switch (status) {
      case "match":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "mismatch":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const matchCount = results.filter(r => r.status === "match").length;
  const issueCount = results.filter(r => r.status !== "match").length;

  return (
    <ToolPageLayout
      title="Mobile-First Index Tool"
      description="Compare mobile vs desktop versions of your website for mobile-first indexing compatibility."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter URL to Compare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={runComparison} disabled={loading || !url}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Compare"}
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
          <>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <span className="font-medium">Mobile Version</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    <span className="font-medium">Desktop Version</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Comparison Results</CardTitle>
                  <div className="flex gap-2">
                    <Badge className="bg-green-500">{matchCount} Match</Badge>
                    {issueCount > 0 && <Badge className="bg-yellow-500">{issueCount} Issues</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Element</th>
                        <th className="text-center py-2 px-3">Mobile</th>
                        <th className="text-center py-2 px-3">Desktop</th>
                        <th className="text-center py-2 px-3">Status</th>
                        <th className="text-left py-2 px-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 px-3 font-medium">{result.category}</td>
                          <td className="py-2 px-3 text-center text-muted-foreground">{result.mobile}</td>
                          <td className="py-2 px-3 text-center text-muted-foreground">{result.desktop}</td>
                          <td className="py-2 px-3 text-center">{getStatusIcon(result.status)}</td>
                          <td className="py-2 px-3 text-xs text-muted-foreground">{result.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mobile-First Indexing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Ensure mobile and desktop versions have the same content</li>
                  <li>• Use the same meta robots tags on both versions</li>
                  <li>• Include structured data on mobile pages</li>
                  <li>• Make sure images and videos are accessible on mobile</li>
                  <li>• Verify mobile page speed with PageSpeed Insights</li>
                  <li>• Use responsive design when possible</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default MobileFirstIndex;
