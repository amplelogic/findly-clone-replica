import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ValidationResult {
  type: "success" | "error" | "warning";
  message: string;
}

interface HreflangTag {
  hreflang: string;
  href: string;
}

const HreflangTesting = () => {
  const [htmlInput, setHtmlInput] = useState(`<link rel="alternate" hreflang="en" href="https://example.com/en/" />
<link rel="alternate" hreflang="es" href="https://example.com/es/" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />`);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [parsedTags, setParsedTags] = useState<HreflangTag[]>([]);

  const validLanguageCodes = [
    "en", "es", "fr", "de", "it", "pt", "nl", "ru", "zh", "ja", "ko", "ar",
    "en-us", "en-gb", "en-au", "en-ca", "es-es", "es-mx", "pt-br", "pt-pt",
    "zh-cn", "zh-tw", "x-default"
  ];

  const validateHreflang = () => {
    const newResults: ValidationResult[] = [];
    const tags: HreflangTag[] = [];

    // Parse hreflang tags
    const regex = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi;
    const regex2 = /<link[^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["'][^>]*\/?>/gi;
    const regex3 = /<link[^>]*href=["']([^"']+)["'][^>]*hreflang=["']([^"']+)["'][^>]*rel=["']alternate["'][^>]*\/?>/gi;

    let match;
    while ((match = regex.exec(htmlInput)) !== null) {
      tags.push({ hreflang: match[1], href: match[2] });
    }
    while ((match = regex2.exec(htmlInput)) !== null) {
      tags.push({ hreflang: match[1], href: match[2] });
    }
    while ((match = regex3.exec(htmlInput)) !== null) {
      tags.push({ hreflang: match[2], href: match[1] });
    }

    setParsedTags(tags);

    if (tags.length === 0) {
      newResults.push({
        type: "error",
        message: "No valid hreflang tags found in the input."
      });
      setResults(newResults);
      return;
    }

    newResults.push({
      type: "success",
      message: `Found ${tags.length} hreflang tag(s).`
    });

    // Check for x-default
    const hasXDefault = tags.some(t => t.hreflang === "x-default");
    if (!hasXDefault) {
      newResults.push({
        type: "warning",
        message: "Missing x-default tag. Recommended for specifying the default/fallback page."
      });
    } else {
      newResults.push({
        type: "success",
        message: "x-default tag found."
      });
    }

    // Check for valid language codes
    const invalidCodes = tags.filter(t => 
      !validLanguageCodes.includes(t.hreflang.toLowerCase()) && 
      !t.hreflang.match(/^[a-z]{2}(-[a-z]{2})?$/i)
    );
    if (invalidCodes.length > 0) {
      invalidCodes.forEach(t => {
        newResults.push({
          type: "error",
          message: `Invalid language code: "${t.hreflang}". Use ISO 639-1 format.`
        });
      });
    }

    // Check for duplicate language codes
    const codes = tags.map(t => t.hreflang.toLowerCase());
    const duplicates = codes.filter((code, index) => codes.indexOf(code) !== index);
    if (duplicates.length > 0) {
      newResults.push({
        type: "error",
        message: `Duplicate language codes found: ${[...new Set(duplicates)].join(", ")}`
      });
    } else {
      newResults.push({
        type: "success",
        message: "No duplicate language codes."
      });
    }

    // Check for valid URLs
    const invalidUrls = tags.filter(t => {
      try {
        new URL(t.href);
        return false;
      } catch {
        return true;
      }
    });
    if (invalidUrls.length > 0) {
      invalidUrls.forEach(t => {
        newResults.push({
          type: "error",
          message: `Invalid URL for ${t.hreflang}: "${t.href}"`
        });
      });
    } else {
      newResults.push({
        type: "success",
        message: "All URLs are valid."
      });
    }

    // Check if all URLs use same protocol
    const protocols = [...new Set(tags.map(t => {
      try {
        return new URL(t.href).protocol;
      } catch {
        return null;
      }
    }).filter(Boolean))];
    if (protocols.length > 1) {
      newResults.push({
        type: "warning",
        message: "Mixed protocols detected (http/https). Use consistent HTTPS."
      });
    }

    setResults(newResults);
  };

  const getIcon = (type: ValidationResult["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <ToolPageLayout
      title="Hreflang Tags Testing Tool"
      description="Validate your hreflang tags for international SEO. Check for common errors and best practices."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Paste Your Hreflang Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder='<link rel="alternate" hreflang="en" href="https://example.com/en/" />'
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <Button onClick={validateHreflang} className="w-full">
                Validate Hreflang Tags
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {parsedTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Parsed Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {parsedTags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <Badge variant="secondary" className="font-mono">
                        {tag.hreflang}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        {tag.href}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.map((result, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                      {getIcon(result.type)}
                      <span className="text-sm">{result.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hreflang Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• Use ISO 639-1 language codes (en, es, fr)</li>
                <li>• Include regional variants when needed (en-us, en-gb)</li>
                <li>• Always include x-default for fallback</li>
                <li>• Use absolute URLs with HTTPS</li>
                <li>• Ensure bidirectional linking (each page links to all versions)</li>
                <li>• Self-referencing hreflang is required</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default HreflangTesting;
