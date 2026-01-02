import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Calendar, User, AlertCircle, CheckCircle } from "lucide-react";

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author: string;
}

interface FeedInfo {
  title: string;
  description: string;
  link: string;
  items: FeedItem[];
  isValid: boolean;
  errors: string[];
}

const RssFeedParser = () => {
  const [feedUrl, setFeedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedInfo, setFeedInfo] = useState<FeedInfo | null>(null);
  const [error, setError] = useState("");

  const parseFeed = async () => {
    if (!feedUrl) return;
    
    setLoading(true);
    setError("");
    setFeedInfo(null);

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      
      const errors: string[] = [];
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        errors.push("XML parsing error detected");
      }

      // Try RSS 2.0 format
      let channel = xmlDoc.querySelector("channel");
      let items: Element[] = [];
      
      if (channel) {
        items = Array.from(channel.querySelectorAll("item"));
      } else {
        // Try Atom format
        const feed = xmlDoc.querySelector("feed");
        if (feed) {
          items = Array.from(feed.querySelectorAll("entry"));
        }
      }

      if (items.length === 0) {
        errors.push("No items found in feed");
      }

      const feedTitle = xmlDoc.querySelector("channel > title, feed > title")?.textContent || "Untitled Feed";
      const feedDescription = xmlDoc.querySelector("channel > description, feed > subtitle")?.textContent || "";
      const feedLink = xmlDoc.querySelector("channel > link, feed > link")?.getAttribute("href") || 
                       xmlDoc.querySelector("channel > link, feed > link")?.textContent || "";

      const parsedItems: FeedItem[] = items.slice(0, 20).map(item => ({
        title: item.querySelector("title")?.textContent || "Untitled",
        link: item.querySelector("link")?.getAttribute("href") || 
              item.querySelector("link")?.textContent || "",
        description: item.querySelector("description, summary, content")?.textContent?.slice(0, 200) || "",
        pubDate: item.querySelector("pubDate, published, updated")?.textContent || "",
        author: item.querySelector("author, dc\\:creator")?.textContent || ""
      }));

      // Validation checks
      if (!feedTitle || feedTitle === "Untitled Feed") {
        errors.push("Missing feed title");
      }
      
      parsedItems.forEach((item, i) => {
        if (!item.title || item.title === "Untitled") {
          errors.push(`Item ${i + 1}: Missing title`);
        }
        if (!item.link) {
          errors.push(`Item ${i + 1}: Missing link`);
        }
      });

      setFeedInfo({
        title: feedTitle,
        description: feedDescription,
        link: feedLink,
        items: parsedItems,
        isValid: errors.length === 0,
        errors
      });
    } catch (err) {
      setError("Failed to parse the feed. Make sure the URL is a valid RSS/Atom feed.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <ToolPageLayout
      title="RSS Feed Parser"
      description="Parse and validate RSS and Atom feeds for content syndication."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter RSS/Atom Feed URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/feed.xml"
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={parseFeed} disabled={loading || !feedUrl}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Parse Feed"}
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

        {feedInfo && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{feedInfo.title}</CardTitle>
                    <Badge variant={feedInfo.isValid ? "default" : "destructive"}>
                      {feedInfo.isValid ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Valid</>
                      ) : (
                        <><AlertCircle className="h-3 w-3 mr-1" /> Issues Found</>
                      )}
                    </Badge>
                  </div>
                  {feedInfo.description && (
                    <p className="text-sm text-muted-foreground">{feedInfo.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    {feedInfo.items.length} items found
                  </p>
                </CardContent>
              </Card>

              {feedInfo.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-destructive">Validation Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs space-y-1">
                      {feedInfo.errors.map((err, i) => (
                        <li key={i} className="text-muted-foreground">• {err}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feed Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {feedInfo.items.map((item, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline shrink-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.description.replace(/<[^>]*>/g, "")}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {item.pubDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.pubDate)}
                          </span>
                        )}
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.author}
                          </span>
                        )}
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

export default RssFeedParser;
