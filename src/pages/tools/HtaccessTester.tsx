import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface RedirectResult {
  originalUrl: string;
  finalUrl: string;
  matched: boolean;
  rule: string;
}

const HtaccessTester = () => {
  const [htaccess, setHtaccess] = useState(`RewriteEngine On
RewriteBase /

# Redirect old pages to new
RewriteRule ^old-page/?$ /new-page [R=301,L]
RewriteRule ^blog/(.*)$ /articles/$1 [R=301,L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove trailing slash
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)/$ /$1 [R=301,L]`);
  const [testUrl, setTestUrl] = useState("/old-page");
  const [results, setResults] = useState<RedirectResult[]>([]);

  const parseRules = () => {
    const rules: { pattern: RegExp; replacement: string; flags: string }[] = [];
    const lines = htaccess.split("\n");
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("RewriteRule")) {
        const match = trimmed.match(/RewriteRule\s+(\S+)\s+(\S+)(?:\s+\[([^\]]+)\])?/);
        if (match) {
          try {
            const pattern = new RegExp(match[1]);
            rules.push({
              pattern,
              replacement: match[2],
              flags: match[3] || ""
            });
          } catch (e) {
            // Invalid regex, skip
          }
        }
      }
    }
    return rules;
  };

  const testRedirect = () => {
    const rules = parseRules();
    const newResults: RedirectResult[] = [];
    
    let currentUrl = testUrl;
    let iterations = 0;
    const maxIterations = 10;

    while (iterations < maxIterations) {
      let matched = false;
      
      for (const rule of rules) {
        if (rule.pattern.test(currentUrl)) {
          const newUrl = currentUrl.replace(rule.pattern, rule.replacement);
          
          // Handle backreferences
          const finalUrl = newUrl.replace(/\$(\d+)/g, (_, n) => {
            const match = currentUrl.match(rule.pattern);
            return match?.[parseInt(n)] || "";
          });

          newResults.push({
            originalUrl: currentUrl,
            finalUrl: finalUrl,
            matched: true,
            rule: `RewriteRule ${rule.pattern.source} ${rule.replacement}`
          });

          currentUrl = finalUrl;
          matched = true;

          // Check for L flag (last)
          if (rule.flags.includes("L")) {
            iterations = maxIterations;
          }
          break;
        }
      }

      if (!matched) {
        if (newResults.length === 0) {
          newResults.push({
            originalUrl: testUrl,
            finalUrl: testUrl,
            matched: false,
            rule: "No matching rules"
          });
        }
        break;
      }
      
      iterations++;
    }

    setResults(newResults);
  };

  return (
    <ToolPageLayout
      title=".htaccess Tester"
      description="Test and validate your .htaccess redirect rules before deploying them."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">.htaccess Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your .htaccess rules here..."
                value={htaccess}
                onChange={(e) => setHtaccess(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>URL Path to Test</Label>
                <Input
                  placeholder="/old-page"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                />
              </div>
              <Button onClick={testRedirect} className="w-full">
                Test Redirect
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Redirect Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.map((result, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {result.matched ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Badge variant={result.matched ? "default" : "secondary"}>
                          {result.matched ? "Matched" : "No Match"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <code className="bg-background px-2 py-1 rounded">{result.originalUrl}</code>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <code className="bg-background px-2 py-1 rounded text-primary">{result.finalUrl}</code>
                      </div>
                      {result.matched && (
                        <p className="text-xs text-muted-foreground mt-2 font-mono">
                          {result.rule}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Common .htaccess Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium mb-1">301 Redirect</p>
                <pre className="bg-muted p-2 rounded text-xs font-mono">
                  Redirect 301 /old-page /new-page
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Force HTTPS</p>
                <pre className="bg-muted p-2 rounded text-xs font-mono whitespace-pre-wrap">
{`RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Remove www</p>
                <pre className="bg-muted p-2 rounded text-xs font-mono whitespace-pre-wrap">
{`RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]`}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Remove Trailing Slash</p>
                <pre className="bg-muted p-2 rounded text-xs font-mono whitespace-pre-wrap">
{`RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)/$ /$1 [R=301,L]`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default HtaccessTester;
