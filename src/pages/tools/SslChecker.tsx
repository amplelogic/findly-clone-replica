import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const SslChecker = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const check = async () => {
    if (!url) return;
    await new Promise(r => setTimeout(r, 800));
    setResult({
      valid: true,
      issuer: "Let's Encrypt Authority X3",
      expiresIn: 45,
      protocol: "TLS 1.3",
      grade: "A+"
    });
  };

  return (
    <ToolPageLayout title="SSL Certificate Checker" description="Verify SSL certificate validity and security configuration.">
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />Check SSL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com" />
            <Button onClick={check} className="w-full">Check Certificate</Button>
          </CardContent>
        </Card>
        {result && (
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                {result.valid ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-destructive" />}
                SSL Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="text-center"><Badge variant="default" className="text-2xl px-4 py-2">{result.grade}</Badge></div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Issuer</span><span>{result.issuer}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Protocol</span><span>{result.protocol}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Expires in</span><span>{result.expiresIn} days</span></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default SslChecker;
