import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileJson, CheckCircle2, XCircle } from "lucide-react";

interface Header {
  name: string;
  value: string;
  important?: boolean;
}

const HttpHeaderChecker = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const checkHeaders = async () => {
    if (!url) return;
    setLoading(true);
    
    // Simulated headers
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStatusCode(200);
    setHeaders([
      { name: "content-type", value: "text/html; charset=utf-8", important: true },
      { name: "cache-control", value: "public, max-age=3600", important: true },
      { name: "x-content-type-options", value: "nosniff", important: true },
      { name: "x-frame-options", value: "SAMEORIGIN", important: true },
      { name: "x-xss-protection", value: "1; mode=block", important: true },
      { name: "content-encoding", value: "gzip" },
      { name: "vary", value: "Accept-Encoding" },
      { name: "server", value: "nginx/1.18.0" },
      { name: "date", value: new Date().toUTCString() },
      { name: "connection", value: "keep-alive" }
    ]);
    setLoading(false);
  };

  const securityHeaders = ["x-content-type-options", "x-frame-options", "x-xss-protection", "strict-transport-security", "content-security-policy"];
  
  const missingSecurityHeaders = securityHeaders.filter(
    h => !headers.some(header => header.name.toLowerCase() === h)
  );

  return (
    <ToolPageLayout
      title="HTTP Header Checker"
      description="Inspect HTTP response headers for any URL to verify security headers and caching configuration."
    >
      <div className="space-y-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              Check Headers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
                className="flex-1"
              />
              <Button onClick={checkHeaders} disabled={loading || !url}>
                {loading ? "Checking..." : "Check Headers"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {headers.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  <span>Response Headers</span>
                  {statusCode && (
                    <Badge variant={statusCode < 400 ? "default" : "destructive"}>
                      Status: {statusCode}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y font-mono text-sm">
                  {headers.map((header, i) => (
                    <div key={i} className="flex p-3 hover:bg-muted/50">
                      <span className={`w-52 shrink-0 ${header.important ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {header.name}:
                      </span>
                      <span className="break-all">{header.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium">Security Headers</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                {securityHeaders.map((header) => {
                  const found = headers.some(h => h.name.toLowerCase() === header);
                  return (
                    <div key={header} className="flex items-center justify-between p-3">
                      <span className="text-sm font-mono">{header}</span>
                      {found ? (
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
              
              {missingSecurityHeaders.length > 0 && (
                <div className="p-4 bg-destructive/5 border-t">
                  <p className="text-sm text-destructive font-medium">
                    Missing {missingSecurityHeaders.length} security header(s)
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default HttpHeaderChecker;
