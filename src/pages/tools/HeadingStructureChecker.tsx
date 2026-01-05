import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Heading } from "lucide-react";

interface HeadingItem {
  level: number;
  text: string;
  issue?: string;
}

const HeadingStructureChecker = () => {
  const [html, setHtml] = useState("");
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [issues, setIssues] = useState<string[]>([]);

  const analyzeHeadings = () => {
    const regex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    const matches: HeadingItem[] = [];
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      matches.push({
        level: parseInt(match[1]),
        text: match[2].replace(/<[^>]*>/g, '').trim()
      });
    }
    
    const foundIssues: string[] = [];
    const h1Count = matches.filter(h => h.level === 1).length;
    
    if (h1Count === 0) foundIssues.push("No H1 tag found on the page");
    if (h1Count > 1) foundIssues.push(`Multiple H1 tags found (${h1Count}). Use only one H1 per page`);
    
    // Check for skipped levels
    let prevLevel = 0;
    matches.forEach((heading, index) => {
      if (heading.level - prevLevel > 1 && prevLevel !== 0) {
        matches[index].issue = `Skipped heading level (H${prevLevel} to H${heading.level})`;
        foundIssues.push(`Heading hierarchy skips from H${prevLevel} to H${heading.level}`);
      }
      prevLevel = heading.level;
    });
    
    setHeadings(matches);
    setIssues(foundIssues);
  };

  return (
    <ToolPageLayout
      title="Heading Structure Checker"
      description="Validate your page's H1-H6 heading hierarchy for proper SEO structure and accessibility."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Heading className="h-5 w-5 text-primary" />
              Paste HTML
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>HTML Content</Label>
              <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="<h1>Main Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1.1</h3>
<h2>Section 2</h2>"
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <Button onClick={analyzeHeadings} className="w-full">
              Analyze Headings
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {issues.length > 0 && (
            <Card className="border-destructive/50">
              <CardHeader className="border-b bg-destructive/5">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Issues Found ({issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {headings.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  {issues.length === 0 && <CheckCircle2 className="h-5 w-5 text-accent" />}
                  Heading Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {headings.map((heading, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-2 rounded ${heading.issue ? 'bg-destructive/10' : 'bg-muted/50'}`}
                      style={{ paddingLeft: `${(heading.level - 1) * 16 + 8}px` }}
                    >
                      <Badge variant={heading.level === 1 ? "default" : "secondary"} className="shrink-0">
                        H{heading.level}
                      </Badge>
                      <span className="text-sm truncate">{heading.text || "(empty)"}</span>
                      {heading.issue && (
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {headings.length === 0 && html && (
            <Card className="border-border/50">
              <CardContent className="p-6 text-center text-muted-foreground">
                No headings found in the provided HTML
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default HeadingStructureChecker;
