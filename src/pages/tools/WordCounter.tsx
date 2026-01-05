import { useState, useMemo } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Type, FileText, Clock, AlignLeft } from "lucide-react";

const WordCounter = () => {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // 200 WPM average
    const speakingTime = Math.ceil(words / 150); // 150 WPM speaking
    
    return {
      chars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    };
  }, [text]);

  return (
    <ToolPageLayout
      title="Word & Character Counter"
      description="Count words, characters, sentences, and estimate reading time for your content."
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Your Text
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your content here..."
                rows={16}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <StatRow icon={FileText} label="Words" value={stats.words.toLocaleString()} />
                <StatRow icon={Type} label="Characters" value={stats.chars.toLocaleString()} />
                <StatRow icon={Type} label="Characters (no spaces)" value={stats.charsNoSpaces.toLocaleString()} />
                <StatRow icon={AlignLeft} label="Sentences" value={stats.sentences.toLocaleString()} />
                <StatRow icon={AlignLeft} label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Time Estimates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <StatRow 
                  icon={Clock} 
                  label="Reading time" 
                  value={`${stats.readingTime} min`} 
                  sublabel="@ 200 WPM"
                />
                <StatRow 
                  icon={Clock} 
                  label="Speaking time" 
                  value={`${stats.speakingTime} min`}
                  sublabel="@ 150 WPM"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

const StatRow = ({ icon: Icon, label, value, sublabel }: { icon: any; label: string; value: string; sublabel?: string }) => (
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <span className="text-sm">{label}</span>
        {sublabel && <span className="text-xs text-muted-foreground ml-1">{sublabel}</span>}
      </div>
    </div>
    <span className="font-mono font-medium">{value}</span>
  </div>
);

export default WordCounter;
