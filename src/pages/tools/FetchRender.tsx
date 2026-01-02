import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";

const FetchRender = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    html: string;
    headers: Record<string, string>;
    statusCode: number;
    loadTime: number;
    title: string;
    metaDescription: string;
    h1Tags: string[];
    links: { href: string; text: string }[];
    images: { src: string; alt: string }[];
  } | null>(null);
  const [error, setError] = useState("");

  const fetchPage = async () => {
    if (!url) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Using a CORS proxy for demonstration
      const startTime = Date.now();
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const loadTime = Date.now() - startTime;

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      const title = doc.querySelector("title")?.textContent || "";
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";
      const h1Tags = Array.from(doc.querySelectorAll("h1")).map(h1 => h1.textContent || "");
      const links = Array.from(doc.querySelectorAll("a[href]")).slice(0, 20).map(a => ({
        href: a.getAttribute("href") || "",
        text: a.textContent?.trim().slice(0, 50) || ""
      }));
      const images = Array.from(doc.querySelectorAll("img")).slice(0, 20).map(img => ({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt") || ""
      }));

      setResult({
        html: data.contents,
        headers: data.status?.response_headers || {},
        statusCode: data.status?.http_code || 200,
        loadTime,
        title,
        metaDescription,
        h1Tags,
        links,
        images
      });
    } catch (err) {
      setError("Failed to fetch the page. The URL might be blocked or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      title="Fetch & Render"
      description="See how search engines view and render your web pages. Analyze HTML structure and content."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter URL to Fetch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={fetchPage} disabled={loading || !url}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
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

        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={result.statusCode === 200 ? "default" : "destructive"}>
                    Status: {result.statusCode}
                  </Badge>
                  <Badge variant="secondary">
                    {result.loadTime}ms
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="seo">
                <TabsList>
                  <TabsTrigger value="seo">SEO Elements</TabsTrigger>
                  <TabsTrigger value="links">Links ({result.links.length})</TabsTrigger>
                  <TabsTrigger value="images">Images ({result.images.length})</TabsTrigger>
                  <TabsTrigger value="html">Raw HTML</TabsTrigger>
                </TabsList>

                <TabsContent value="seo" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Title Tag</Label>
                    <p className="p-2 bg-muted rounded text-sm">{result.title || "No title found"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Meta Description</Label>
                    <p className="p-2 bg-muted rounded text-sm">{result.metaDescription || "No description found"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">H1 Tags ({result.h1Tags.length})</Label>
                    {result.h1Tags.length > 0 ? (
                      <ul className="space-y-1">
                        {result.h1Tags.map((h1, i) => (
                          <li key={i} className="p-2 bg-muted rounded text-sm">{h1}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-2 bg-muted rounded text-sm text-muted-foreground">No H1 tags found</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="links" className="mt-4">
                  <div className="max-h-[400px] overflow-y-auto space-y-1">
                    {result.links.map((link, i) => (
                      <div key={i} className="p-2 bg-muted rounded text-sm flex items-center gap-2">
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate flex-1">{link.text || "(no text)"}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{link.href}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="images" className="mt-4">
                  <div className="max-h-[400px] overflow-y-auto space-y-1">
                    {result.images.map((img, i) => (
                      <div key={i} className="p-2 bg-muted rounded text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={img.alt ? "default" : "destructive"} className="text-xs">
                            {img.alt ? "Has Alt" : "No Alt"}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate">{img.src}</span>
                        </div>
                        {img.alt && <p className="text-xs mt-1">Alt: {img.alt}</p>}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="html" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                    {result.html.slice(0, 10000)}
                    {result.html.length > 10000 && "\n\n... (truncated)"}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default FetchRender;
