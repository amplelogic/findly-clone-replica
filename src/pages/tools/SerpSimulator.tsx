import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SerpSimulator = () => {
  const [title, setTitle] = useState("Your Page Title - Brand Name");
  const [url, setUrl] = useState("https://example.com/page");
  const [description, setDescription] = useState("This is your meta description. It should be compelling and include your target keywords. Keep it under 160 characters for best display.");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const titleLength = title.length;
  const descLength = description.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { color: "bg-muted", text: "Empty" };
    if (titleLength < 30) return { color: "bg-yellow-500", text: "Too Short" };
    if (titleLength <= 60) return { color: "bg-green-500", text: "Good" };
    return { color: "bg-red-500", text: "Too Long" };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { color: "bg-muted", text: "Empty" };
    if (descLength < 120) return { color: "bg-yellow-500", text: "Too Short" };
    if (descLength <= 160) return { color: "bg-green-500", text: "Good" };
    return { color: "bg-red-500", text: "Too Long" };
  };

  const truncateTitle = device === "desktop" ? 60 : 55;
  const truncateDesc = device === "desktop" ? 160 : 120;

  const displayTitle = title.length > truncateTitle ? title.slice(0, truncateTitle) + "..." : title;
  const displayDesc = description.length > truncateDesc ? description.slice(0, truncateDesc) + "..." : description;

  const formatUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname}`;
    } catch {
      return url;
    }
  };

  return (
    <ToolPageLayout
      title="SERP Simulator"
      description="Preview how your pages will appear in Google search results. Optimize your titles and descriptions."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="title">Title Tag</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{titleLength}/60</span>
                    <Badge className={`${getTitleStatus().color} text-xs`}>
                      {getTitleStatus().text}
                    </Badge>
                  </div>
                </div>
                <Input
                  id="title"
                  placeholder="Your Page Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="description">Meta Description</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{descLength}/160</span>
                    <Badge className={`${getDescStatus().color} text-xs`}>
                      {getDescStatus().text}
                    </Badge>
                  </div>
                </div>
                <Textarea
                  id="description"
                  placeholder="Your meta description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Device Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <button
                  onClick={() => setDevice("desktop")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    device === "desktop" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setDevice("mobile")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    device === "mobile" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Mobile
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Google Search Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 bg-background rounded-lg border ${device === "mobile" ? "max-w-[360px]" : ""}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                      {url ? formatUrl(url).charAt(0).toUpperCase() : "E"}
                    </div>
                    <div>
                      <div className="text-foreground text-sm">
                        {url ? new URL(url).hostname.replace("www.", "") : "example.com"}
                      </div>
                      <div className="text-xs">{formatUrl(url)}</div>
                    </div>
                  </div>
                  <h3 className="text-[#1a0dab] hover:underline cursor-pointer text-lg leading-tight">
                    {displayTitle || "Page Title"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {displayDesc || "Meta description will appear here..."}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Optimization Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Title: Aim for 50-60 characters</li>
                  <li>• Description: Aim for 150-160 characters</li>
                  <li>• Include primary keyword near the beginning</li>
                  <li>• Make it compelling to increase CTR</li>
                  <li>• Use action words when appropriate</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default SerpSimulator;
