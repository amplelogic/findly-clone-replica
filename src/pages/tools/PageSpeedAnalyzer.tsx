import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gauge, Clock, Zap, Image, FileCode } from "lucide-react";

interface SpeedResult {
  score: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  suggestions: string[];
}

const PageSpeedAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpeedResult | null>(null);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    
    // Simulated analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setResult({
      score: Math.floor(Math.random() * 40) + 50,
      lcp: 1.5 + Math.random() * 2,
      fid: 50 + Math.random() * 100,
      cls: Math.random() * 0.2,
      ttfb: 200 + Math.random() * 400,
      suggestions: [
        "Enable text compression (Gzip/Brotli)",
        "Optimize and compress images",
        "Minimize main-thread work",
        "Reduce JavaScript execution time",
        "Use a Content Delivery Network (CDN)"
      ]
    });
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-accent";
    if (score >= 50) return "text-yellow-500";
    return "text-destructive";
  };

  const getMetricStatus = (value: number, good: number, poor: number) => {
    if (value <= good) return "default";
    if (value <= poor) return "secondary";
    return "destructive";
  };

  return (
    <ToolPageLayout
      title="Page Speed Analyzer"
      description="Analyze page load time and get optimization suggestions to improve your Core Web Vitals."
    >
      <div className="space-y-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              Analyze URL
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
              <Button onClick={analyze} disabled={loading || !url}>
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-border/50 lg:row-span-2">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium">Performance Score</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-40 h-40 -rotate-90">
                    <circle
                      cx="80" cy="80" r="70"
                      className="stroke-muted fill-none"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80" cy="80" r="70"
                      className={`fill-none ${result.score >= 90 ? 'stroke-accent' : result.score >= 50 ? 'stroke-yellow-500' : 'stroke-destructive'}`}
                      strokeWidth="12"
                      strokeDasharray={`${result.score * 4.4} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`absolute text-4xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                </div>
                <p className="text-muted-foreground mt-4">
                  {result.score >= 90 ? "Good" : result.score >= 50 ? "Needs Improvement" : "Poor"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium">Core Web Vitals</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                <MetricRow 
                  icon={Clock}
                  label="Largest Contentful Paint (LCP)"
                  value={`${result.lcp.toFixed(1)}s`}
                  status={getMetricStatus(result.lcp, 2.5, 4)}
                />
                <MetricRow 
                  icon={Zap}
                  label="First Input Delay (FID)"
                  value={`${result.fid.toFixed(0)}ms`}
                  status={getMetricStatus(result.fid, 100, 300)}
                />
                <MetricRow 
                  icon={Image}
                  label="Cumulative Layout Shift (CLS)"
                  value={result.cls.toFixed(3)}
                  status={getMetricStatus(result.cls, 0.1, 0.25)}
                />
                <MetricRow 
                  icon={FileCode}
                  label="Time to First Byte (TTFB)"
                  value={`${result.ttfb.toFixed(0)}ms`}
                  status={getMetricStatus(result.ttfb, 200, 500)}
                />
              </CardContent>
            </Card>

            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg font-medium">Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Badge variant="secondary" className="shrink-0 mt-0.5">{i + 1}</Badge>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

const MetricRow = ({ icon: Icon, label, value, status }: { icon: any; label: string; value: string; status: "default" | "secondary" | "destructive" }) => (
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{label}</span>
    </div>
    <Badge variant={status}>{value}</Badge>
  </div>
);

export default PageSpeedAnalyzer;
