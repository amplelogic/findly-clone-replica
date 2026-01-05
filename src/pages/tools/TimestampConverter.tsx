import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock, ArrowRightLeft } from "lucide-react";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<{ unix: number; iso: string; local: string } | null>(null);

  const convertFromTimestamp = () => {
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return;
    const d = new Date(ts * 1000);
    setResult({ unix: ts, iso: d.toISOString(), local: d.toLocaleString() });
  };

  const convertFromDate = () => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return;
    setResult({ unix: Math.floor(d.getTime() / 1000), iso: d.toISOString(), local: d.toLocaleString() });
  };

  const now = () => {
    const d = new Date();
    setResult({ unix: Math.floor(d.getTime() / 1000), iso: d.toISOString(), local: d.toLocaleString() });
  };

  return (
    <ToolPageLayout title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30"><CardTitle className="text-lg font-medium flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Convert</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label>Unix Timestamp</Label><div className="flex gap-2"><Input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="1704067200" /><Button onClick={convertFromTimestamp}>Convert</Button></div></div>
            <div className="text-center text-muted-foreground">or</div>
            <div className="space-y-2"><Label>Date & Time</Label><div className="flex gap-2"><Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} /><Button onClick={convertFromDate}>Convert</Button></div></div>
            <Button onClick={now} variant="outline" className="w-full">Get Current Time</Button>
          </CardContent>
        </Card>
        {result && (
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30"><CardTitle className="text-lg font-medium">Result</CardTitle></CardHeader>
            <CardContent className="p-0 divide-y">
              <div className="p-4"><Label className="text-muted-foreground text-xs">Unix Timestamp</Label><p className="font-mono text-lg mt-1">{result.unix}</p></div>
              <div className="p-4"><Label className="text-muted-foreground text-xs">ISO 8601</Label><p className="font-mono text-lg mt-1">{result.iso}</p></div>
              <div className="p-4"><Label className="text-muted-foreground text-xs">Local Time</Label><p className="font-mono text-lg mt-1">{result.local}</p></div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default TimestampConverter;
