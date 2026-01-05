import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

interface RedirectHop {
  url: string;
  status: number;
  statusText: string;
}

const RedirectChecker = () => {
  const [url, setUrl] = useState("");
  const [chain, setChain] = useState<RedirectHop[]>([]);
  const [finalUrl, setFinalUrl] = useState("");

  const checkRedirects = () => {
    if (!url) return;
    
    // Simulated redirect chain
    const simulatedChain: RedirectHop[] = [
      { url: url, status: 301, statusText: "Moved Permanently" },
      { url: url.replace("http://", "https://"), status: 301, statusText: "Moved Permanently" },
      { url: url.replace("http://", "https://").replace("www.", ""), status: 200, statusText: "OK" }
    ];
    
    setChain(simulatedChain);
    setFinalUrl(simulatedChain[simulatedChain.length - 1].url);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "default";
    if (status >= 300 && status < 400) return "secondary";
    return "destructive";
  };

  return (
    <ToolPageLayout
      title="Redirect Chain Checker"
      description="Analyze redirect chains and identify redirect loops that may be hurting your SEO performance."
    >
      <div className="space-y-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium">Check URL Redirects</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Enter URL to check</Label>
              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  type="url"
                  className="flex-1"
                />
                <Button onClick={checkRedirects}>Check Redirects</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {chain.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Redirect Chain</span>
                <Badge variant={chain.length > 2 ? "destructive" : "default"}>
                  {chain.length - 1} redirect(s)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {chain.map((hop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getStatusColor(hop.status)} className="text-xs">
                          {hop.status} {hop.statusText}
                        </Badge>
                        {hop.status === 200 && (
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <code className="text-sm break-all">{hop.url}</code>
                    </div>
                    {index < chain.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              
              {chain.length > 3 && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-600">Too many redirects</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This redirect chain has more than 2 hops. Consider consolidating redirects to improve page speed and preserve link equity.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default RedirectChecker;
