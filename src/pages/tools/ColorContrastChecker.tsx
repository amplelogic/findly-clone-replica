import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, CheckCircle2, XCircle } from "lucide-react";

const ColorContrastChecker = () => {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getContrastRatio = () => {
    const fgRgb = hexToRgb(fg), bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return 0;
    const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b), l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const ratio = getContrastRatio();
  const passAA = ratio >= 4.5, passAAA = ratio >= 7;

  return (
    <ToolPageLayout title="Color Contrast Checker" description="Check WCAG accessibility compliance for color combinations.">
      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Colors</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label>Foreground</Label><div className="flex gap-2"><Input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-16 h-10 p-1" /><Input value={fg} onChange={(e) => setFg(e.target.value)} /></div></div>
            <div className="space-y-2"><Label>Background</Label><div className="flex gap-2"><Input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-16 h-10 p-1" /><Input value={bg} onChange={(e) => setBg(e.target.value)} /></div></div>
            <div className="p-6 rounded-lg text-center" style={{ backgroundColor: bg, color: fg }}><p className="text-2xl font-bold">Sample Text</p><p>The quick brown fox jumps over the lazy dog.</p></div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30"><CardTitle className="text-lg font-medium">Results</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="text-center"><div className="text-5xl font-bold">{ratio.toFixed(2)}:1</div><p className="text-muted-foreground mt-1">Contrast Ratio</p></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50"><span>WCAG AA (4.5:1)</span>{passAA ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-destructive" />}</div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50"><span>WCAG AAA (7:1)</span>{passAAA ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-destructive" />}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
};

export default ColorContrastChecker;
