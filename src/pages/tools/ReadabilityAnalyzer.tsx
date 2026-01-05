import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileSearch, GraduationCap } from "lucide-react";

interface ReadabilityResult {
  fleschKincaid: number;
  fleschReading: number;
  gradeLevel: string;
  avgSentenceLength: number;
  avgWordLength: number;
}

const ReadabilityAnalyzer = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReadabilityResult | null>(null);

  const countSyllables = (word: string) => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const analyze = () => {
    if (!text.trim()) return;
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w);
    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    
    const totalWords = words.length;
    const totalSentences = sentences.length || 1;
    const totalSyllables = syllables;
    
    // Flesch Reading Ease
    const fleschReading = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
    
    // Flesch-Kincaid Grade Level
    const fleschKincaid = 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59;
    
    let gradeLevel = "";
    if (fleschReading >= 90) gradeLevel = "5th Grade";
    else if (fleschReading >= 80) gradeLevel = "6th Grade";
    else if (fleschReading >= 70) gradeLevel = "7th Grade";
    else if (fleschReading >= 60) gradeLevel = "8th-9th Grade";
    else if (fleschReading >= 50) gradeLevel = "10th-12th Grade";
    else if (fleschReading >= 30) gradeLevel = "College";
    else gradeLevel = "College Graduate";
    
    setResult({
      fleschKincaid: Math.max(0, fleschKincaid),
      fleschReading: Math.max(0, Math.min(100, fleschReading)),
      gradeLevel,
      avgSentenceLength: totalWords / totalSentences,
      avgWordLength: text.replace(/[^\w]/g, '').length / totalWords
    });
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 60) return "text-accent";
    if (score >= 30) return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <ToolPageLayout
      title="Readability Analyzer"
      description="Check content readability score using Flesch-Kincaid formula to ensure your content is accessible to your target audience."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-primary" />
              Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your content here to analyze its readability..."
              rows={14}
            />
            <Button onClick={analyze} className="w-full">
              Analyze Readability
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Readability Score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getReadabilityColor(result.fleschReading)}`}>
                    {result.fleschReading.toFixed(1)}
                  </div>
                  <p className="text-muted-foreground mt-2">Flesch Reading Ease</p>
                </div>
                
                <Progress value={result.fleschReading} className="h-3" />
                
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {result.gradeLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium">Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                <div className="flex justify-between p-4">
                  <span className="text-muted-foreground">Flesch-Kincaid Grade</span>
                  <span className="font-mono font-medium">{result.fleschKincaid.toFixed(1)}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-muted-foreground">Avg. sentence length</span>
                  <span className="font-mono font-medium">{result.avgSentenceLength.toFixed(1)} words</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-muted-foreground">Avg. word length</span>
                  <span className="font-mono font-medium">{result.avgWordLength.toFixed(1)} chars</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-4 text-sm text-muted-foreground">
                <p className="font-medium mb-2">Score Interpretation:</p>
                <ul className="space-y-1">
                  <li>• 90-100: Very easy to read (5th grade)</li>
                  <li>• 60-70: Easily understood (8th-9th grade)</li>
                  <li>• 30-50: Difficult (College level)</li>
                  <li>• 0-30: Very difficult (Professional)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default ReadabilityAnalyzer;
