import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface KeywordResult {
  keyword: string;
  count: number;
  density: number;
}

const KeywordDensityChecker = () => {
  const [content, setContent] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [wordCount, setWordCount] = useState(0);

  const analyze = () => {
    const words = content.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
    
    // Count word frequencies
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 2) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    // Sort by frequency
    const sorted = Object.entries(wordFreq)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: (count / words.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
    
    // If target keyword specified, add it to top
    if (targetKeyword) {
      const targetLower = targetKeyword.toLowerCase();
      const targetCount = words.filter(w => w === targetLower).length;
      const existing = sorted.find(r => r.keyword === targetLower);
      if (!existing) {
        sorted.unshift({
          keyword: targetLower,
          count: targetCount,
          density: (targetCount / words.length) * 100
        });
      }
    }
    
    setResults(sorted);
  };

  const getDensityColor = (density: number) => {
    if (density < 0.5) return "text-muted-foreground";
    if (density <= 2.5) return "text-accent";
    if (density <= 4) return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <ToolPageLayout
      title="Keyword Density Checker"
      description="Analyze keyword usage and density in your content to optimize for search engines without over-optimization."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Target Keyword (optional)</Label>
              <Input
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="e.g., seo optimization"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here..."
                rows={12}
              />
            </div>
            <Button onClick={analyze} className="w-full">
              Analyze Keyword Density
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Results</span>
                <Badge variant="secondary">{wordCount} words</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {results.map((result, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{result.keyword}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{result.count}x</span>
                        <span className={`font-mono ${getDensityColor(result.density)}`}>
                          {result.density.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={Math.min(result.density * 20, 100)} className="h-1.5" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm space-y-2">
                <p className="font-medium">Density Guidelines:</p>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>• Under 0.5%: Too low</span>
                  <span>• 0.5-2.5%: Optimal</span>
                  <span>• 2.5-4%: High</span>
                  <span>• Over 4%: Over-optimized</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default KeywordDensityChecker;
