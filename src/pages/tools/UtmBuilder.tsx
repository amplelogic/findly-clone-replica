import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UtmBuilder = () => {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const generatedUrl = () => {
    if (!url) return "";
    const params = new URLSearchParams();
    if (source) params.set("utm_source", source);
    if (medium) params.set("utm_medium", medium);
    if (campaign) params.set("utm_campaign", campaign);
    if (term) params.set("utm_term", term);
    if (content) params.set("utm_content", content);
    const paramStr = params.toString();
    return paramStr ? `${url}${url.includes("?") ? "&" : "?"}${paramStr}` : url;
  };

  const copy = () => { navigator.clipboard.writeText(generatedUrl()); toast({ title: "Copied to clipboard" }); };

  return (
    <ToolPageLayout title="UTM Link Builder" description="Build campaign URLs with UTM parameters for tracking.">
      <Card className="border-border/50 max-w-2xl mx-auto">
        <CardHeader className="border-b bg-muted/30"><CardTitle className="text-lg font-medium flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />UTM Builder</CardTitle></CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2"><Label>Website URL *</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/landing-page" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Campaign Source *</Label><Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="google, facebook, newsletter" /></div>
            <div className="space-y-2"><Label>Campaign Medium *</Label><Select value={medium} onValueChange={setMedium}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cpc">cpc</SelectItem><SelectItem value="email">email</SelectItem><SelectItem value="social">social</SelectItem><SelectItem value="organic">organic</SelectItem><SelectItem value="referral">referral</SelectItem></SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label>Campaign Name *</Label><Input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="spring_sale, product_launch" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Campaign Term</Label><Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="running+shoes" /></div>
            <div className="space-y-2"><Label>Campaign Content</Label><Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="banner_ad, text_link" /></div>
          </div>
          {generatedUrl() && url && (
            <div className="space-y-2"><Label>Generated URL</Label><div className="flex gap-2"><Input value={generatedUrl()} readOnly className="bg-muted/50 font-mono text-sm" /><Button onClick={copy} variant="outline" size="icon"><Copy className="h-4 w-4" /></Button></div></div>
          )}
        </CardContent>
      </Card>
    </ToolPageLayout>
  );
};

export default UtmBuilder;
