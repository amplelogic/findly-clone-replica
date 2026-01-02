import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertCircle, Zap } from "lucide-react";

interface ValidationError {
  line: number;
  col: number;
  message: string;
  severity: "error" | "warning";
}

const AmpValidator = () => {
  const [url, setUrl] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [ampHtml, setAmpHtml] = useState("");

  const validateAmp = async (html: string) => {
    const newErrors: ValidationError[] = [];
    
    // Basic AMP validation checks
    const checks = [
      {
        test: () => !html.includes("<!doctype html>") && !html.includes("<!DOCTYPE html>"),
        message: "Missing or invalid doctype. Use <!doctype html>",
        severity: "error" as const
      },
      {
        test: () => !html.includes("<html ⚡") && !html.includes("<html amp"),
        message: "Missing AMP attribute on html tag. Use <html ⚡> or <html amp>",
        severity: "error" as const
      },
      {
        test: () => !html.includes("<meta charset="),
        message: "Missing charset meta tag. Add <meta charset=\"utf-8\">",
        severity: "error" as const
      },
      {
        test: () => !html.includes('name="viewport"'),
        message: "Missing viewport meta tag",
        severity: "error" as const
      },
      {
        test: () => !html.includes("https://cdn.ampproject.org/v0.js"),
        message: "Missing AMP runtime script",
        severity: "error" as const
      },
      {
        test: () => !html.includes("<style amp-boilerplate>"),
        message: "Missing AMP boilerplate style",
        severity: "error" as const
      },
      {
        test: () => html.includes("<script") && !html.includes("cdn.ampproject.org") && html.includes("</script>"),
        message: "Custom JavaScript is not allowed in AMP pages",
        severity: "error" as const
      },
      {
        test: () => html.includes("<img ") && !html.includes("<amp-img"),
        message: "Use <amp-img> instead of <img>",
        severity: "error" as const
      },
      {
        test: () => html.includes("<video ") && !html.includes("<amp-video"),
        message: "Use <amp-video> instead of <video>",
        severity: "warning" as const
      },
      {
        test: () => html.includes("<iframe ") && !html.includes("<amp-iframe"),
        message: "Use <amp-iframe> instead of <iframe>",
        severity: "error" as const
      },
      {
        test: () => html.includes('style="'),
        message: "Inline styles are restricted in AMP. Use <style amp-custom>",
        severity: "warning" as const
      },
      {
        test: () => html.includes("<form ") && !html.includes("<amp-form"),
        message: "Use amp-form component for forms",
        severity: "warning" as const
      },
      {
        test: () => !html.includes('rel="canonical"'),
        message: "Missing canonical link",
        severity: "error" as const
      }
    ];

    checks.forEach((check, index) => {
      if (check.test()) {
        newErrors.push({
          line: index + 1,
          col: 1,
          message: check.message,
          severity: check.severity
        });
      }
    });

    setErrors(newErrors);
    setIsValid(newErrors.filter(e => e.severity === "error").length === 0);
    setAmpHtml(html);
  };

  const validateUrl = async () => {
    if (!url) return;
    
    setLoading(true);
    setErrors([]);
    setIsValid(null);

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      await validateAmp(data.contents);
    } catch (err) {
      setErrors([{
        line: 0,
        col: 0,
        message: "Failed to fetch the URL",
        severity: "error"
      }]);
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  const validateHtml = async () => {
    if (!htmlInput) return;
    setLoading(true);
    await validateAmp(htmlInput);
    setLoading(false);
  };

  const errorCount = errors.filter(e => e.severity === "error").length;
  const warningCount = errors.filter(e => e.severity === "warning").length;

  return (
    <ToolPageLayout
      title="AMP Validator"
      description="Validate your Accelerated Mobile Pages (AMP) for compliance with AMP specifications."
    >
      <div className="space-y-6">
        <Tabs defaultValue="url">
          <TabsList>
            <TabsTrigger value="url">Validate URL</TabsTrigger>
            <TabsTrigger value="html">Validate HTML</TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Enter AMP Page URL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/amp/article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={validateUrl} disabled={loading || !url}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="html">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Paste AMP HTML</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your AMP HTML here..."
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <Button onClick={validateHtml} disabled={loading || !htmlInput} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validate HTML"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isValid !== null && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Validation Results
                </CardTitle>
                <Badge className={isValid ? "bg-green-500" : "bg-red-500"}>
                  {isValid ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Valid AMP</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Invalid AMP</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {errors.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {errorCount > 0 && <Badge className="bg-red-500">{errorCount} Errors</Badge>}
                    {warningCount > 0 && <Badge className="bg-yellow-500">{warningCount} Warnings</Badge>}
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {errors.map((error, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                        {error.severity === "error" ? (
                          <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm">{error.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No validation errors found!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AMP Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Start with the <code className="bg-muted px-1 rounded">&lt;!doctype html&gt;</code> doctype</li>
              <li>• Include <code className="bg-muted px-1 rounded">&lt;html ⚡&gt;</code> or <code className="bg-muted px-1 rounded">&lt;html amp&gt;</code></li>
              <li>• Load the AMP runtime from <code className="bg-muted px-1 rounded">cdn.ampproject.org</code></li>
              <li>• Include AMP boilerplate code in the head</li>
              <li>• Use <code className="bg-muted px-1 rounded">&lt;amp-img&gt;</code> instead of <code className="bg-muted px-1 rounded">&lt;img&gt;</code></li>
              <li>• No custom JavaScript (except AMP components)</li>
              <li>• All CSS must be inline and max 75KB</li>
              <li>• Include a canonical link to the regular HTML version</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default AmpValidator;
