import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Bot, Info } from "lucide-react";

interface BotResult {
  name: string;
  userAgent: string;
  allowed: boolean;
  reason: string;
}

const aiBots = [
  { name: "GPTBot (OpenAI)", userAgent: "GPTBot" },
  { name: "ChatGPT-User", userAgent: "ChatGPT-User" },
  { name: "Google-Extended", userAgent: "Google-Extended" },
  { name: "CCBot (Common Crawl)", userAgent: "CCBot" },
  { name: "anthropic-ai (Claude)", userAgent: "anthropic-ai" },
  { name: "Claude-Web", userAgent: "Claude-Web" },
  { name: "Bytespider (ByteDance)", userAgent: "Bytespider" },
  { name: "Applebot-Extended", userAgent: "Applebot-Extended" },
  { name: "PerplexityBot", userAgent: "PerplexityBot" },
  { name: "Cohere-ai", userAgent: "cohere-ai" },
];

const AiBotAccess = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BotResult[]>([]);
  const [robotsTxt, setRobotsTxt] = useState("");
  const [error, setError] = useState("");

  const checkAccess = async () => {
    if (!url) return;
    
    setLoading(true);
    setError("");
    setResults([]);
    setRobotsTxt("");

    try {
      // Try to fetch robots.txt
      const baseUrl = new URL(url).origin;
      const robotsUrl = `${baseUrl}/robots.txt`;
      
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(robotsUrl)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      const robots = data.contents || "";
      setRobotsTxt(robots);

      const newResults: BotResult[] = aiBots.map(bot => {
        // Parse robots.txt to check if bot is blocked
        const lines = robots.split("\n");
        let currentUserAgent = "";
        let isBlocked = false;
        let matchesAll = false;
        
        for (const line of lines) {
          const trimmed = line.trim().toLowerCase();
          
          if (trimmed.startsWith("user-agent:")) {
            currentUserAgent = trimmed.replace("user-agent:", "").trim();
            if (currentUserAgent === "*") {
              matchesAll = true;
            }
          }
          
          if (trimmed.startsWith("disallow:") && trimmed.includes("/")) {
            if (currentUserAgent === bot.userAgent.toLowerCase() || 
                currentUserAgent === bot.name.toLowerCase()) {
              isBlocked = true;
            }
          }
        }

        // Check for specific bot blocking
        const specificBlock = robots.toLowerCase().includes(`user-agent: ${bot.userAgent.toLowerCase()}`) &&
          robots.toLowerCase().includes("disallow: /");

        return {
          name: bot.name,
          userAgent: bot.userAgent,
          allowed: !specificBlock && !isBlocked,
          reason: specificBlock 
            ? `Explicitly blocked in robots.txt` 
            : isBlocked 
              ? "Blocked by rule"
              : "No blocking rules found"
        };
      });

      setResults(newResults);
    } catch (err) {
      // If robots.txt doesn't exist, all bots are allowed
      const newResults: BotResult[] = aiBots.map(bot => ({
        name: bot.name,
        userAgent: bot.userAgent,
        allowed: true,
        reason: "No robots.txt found - all bots allowed by default"
      }));
      setResults(newResults);
    } finally {
      setLoading(false);
    }
  };

  const allowedCount = results.filter(r => r.allowed).length;
  const blockedCount = results.filter(r => !r.allowed).length;

  return (
    <ToolPageLayout
      title="AI Bot Access Testing Tool"
      description="Check if AI crawlers (GPTBot, Claude, etc.) can access your website content."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Check AI Bot Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={checkAccess} disabled={loading || !url}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Access"}
              </Button>
            </div>
            {error && (
              <div className="text-destructive text-sm">{error}</div>
            )}
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">AI Bot Access Results</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-green-500">{allowedCount} Allowed</Badge>
                  {blockedCount > 0 && <Badge className="bg-red-500">{blockedCount} Blocked</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {results.map((result, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    {result.allowed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">
                        <Bot className="h-3 w-3" />
                        {result.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {result.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {robotsTxt && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">robots.txt Content</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {robotsTxt}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4" />
              About AI Bot Blocking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              AI companies use web crawlers to train their models. You can control access through robots.txt.
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs font-mono mb-2">Example: Block all AI bots</p>
              <pre className="text-xs font-mono text-muted-foreground">
{`User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default AiBotAccess;
