import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ListChecks, CheckCircle2, AlertTriangle } from "lucide-react";

const DuplicateContentChecker = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [similarity, setSimilarity] = useState<number | null>(null);

  const calculateSimilarity = () => {
    if (!text1 || !text2) return;
    
    const words1 = text1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w);
    const words2 = text2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const jaccardSimilarity = (intersection.size / union.size) * 100;
    setSimilarity(jaccardSimilarity);
  };

  const getSimilarityStatus = (score: number) => {
    if (score < 30) return { text: "Low similarity", variant: "default" as const, icon: CheckCircle2 };
    if (score < 70) return { text: "Moderate similarity", variant: "secondary" as const, icon: AlertTriangle };
    return { text: "High similarity", variant: "destructive" as const, icon: AlertTriangle };
  };

  return (
    <ToolPageLayout
      title="Duplicate Content Checker"
      description="Compare two pieces of text to find duplicate or similar content that could harm your SEO."
    >
      <div className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium">Text 1</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Paste your first text here..."
                rows={10}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium">Text 2</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Paste your second text here..."
                rows={10}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button onClick={calculateSimilarity} size="lg" disabled={!text1 || !text2}>
            <ListChecks className="h-5 w-5 mr-2" />
            Compare Texts
          </Button>
        </div>

        {similarity !== null && (
          <Card className="border-border/50 max-w-xl mx-auto">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium text-center">
                Similarity Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className={`text-5xl font-bold ${
                  similarity < 30 ? 'text-accent' : 
                  similarity < 70 ? 'text-yellow-500' : 
                  'text-destructive'
                }`}>
                  {similarity.toFixed(1)}%
                </div>
                <p className="text-muted-foreground mt-2">Content Similarity</p>
              </div>
              
              <Progress value={similarity} className="h-3" />
              
              <div className="flex justify-center">
                {(() => {
                  const status = getSimilarityStatus(similarity);
                  return (
                    <Badge variant={status.variant} className="flex items-center gap-1.5">
                      <status.icon className="h-3.5 w-3.5" />
                      {status.text}
                    </Badge>
                  );
                })()}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium mb-2">Interpretation:</p>
                <ul className="space-y-1">
                  <li>• &lt;30%: Unique content, no issues</li>
                  <li>• 30-70%: Some overlap, review for originality</li>
                  <li>• &gt;70%: High duplication, may harm SEO</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default DuplicateContentChecker;
