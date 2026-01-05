import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const MetaTagAnalyzer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const titleLength = title.length;
  const descLength = description.length;
  
  const titleScore = titleLength >= 30 && titleLength <= 60 ? 100 : titleLength < 30 ? (titleLength / 30) * 100 : Math.max(0, 100 - ((titleLength - 60) * 5));
  const descScore = descLength >= 120 && descLength <= 160 ? 100 : descLength < 120 ? (descLength / 120) * 100 : Math.max(0, 100 - ((descLength - 160) * 5));

  const analyze = () => setAnalyzed(true);

  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-4 w-4 text-accent" />;
    if (score >= 50) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <ToolPageLayout
      title="Meta Tag Analyzer"
      description="Analyze and optimize your page's meta titles and descriptions for better search engine visibility."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium">Enter Meta Tags</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Meta Title</Label>
                <span className={`text-sm ${titleLength > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {titleLength}/60
                </span>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your page title here"
              />
              <Progress value={Math.min((titleLength / 60) * 100, 100)} className="h-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Meta Description</Label>
                <span className={`text-sm ${descLength > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {descLength}/160
                </span>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Your meta description here"
                rows={3}
              />
              <Progress value={Math.min((descLength / 160) * 100, 100)} className="h-1" />
            </div>
            
            <Button onClick={analyze} className="w-full">
              Analyze Meta Tags
            </Button>
          </CardContent>
        </Card>

        {analyzed && (title || description) && (
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getIcon(titleScore)}
                  <span className="font-medium">Title Tag</span>
                </div>
                <div className="pl-6 space-y-2 text-sm text-muted-foreground">
                  {titleLength === 0 && <p>• Missing title tag</p>}
                  {titleLength > 0 && titleLength < 30 && <p>• Title is too short (min 30 characters)</p>}
                  {titleLength > 60 && <p>• Title is too long (max 60 characters)</p>}
                  {titleLength >= 30 && titleLength <= 60 && <p className="text-accent">• Title length is optimal</p>}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {getIcon(descScore)}
                  <span className="font-medium">Meta Description</span>
                </div>
                <div className="pl-6 space-y-2 text-sm text-muted-foreground">
                  {descLength === 0 && <p>• Missing meta description</p>}
                  {descLength > 0 && descLength < 120 && <p>• Description is too short (min 120 characters)</p>}
                  {descLength > 160 && <p>• Description is too long (max 160 characters)</p>}
                  {descLength >= 120 && descLength <= 160 && <p className="text-accent">• Description length is optimal</p>}
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">SERP Preview</p>
                <div className="space-y-1">
                  <p className="text-primary text-lg hover:underline cursor-pointer truncate">
                    {title || "Page Title"}
                  </p>
                  <p className="text-accent text-sm">example.com</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description || "Meta description will appear here..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default MetaTagAnalyzer;
