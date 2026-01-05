import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { QrCode, Download } from "lucide-react";

const QrCodeGenerator = () => {
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const generate = () => {
    if (!url) return;
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`);
  };

  return (
    <ToolPageLayout title="QR Code Generator" description="Generate QR codes for URLs and marketing campaigns.">
      <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />Generate QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>URL or Text</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
            </div>
            <Button onClick={generate} className="w-full">Generate QR Code</Button>
          </CardContent>
        </Card>
        {qrUrl && (
          <Card className="border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-medium">Your QR Code</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <img src={qrUrl} alt="QR Code" className="rounded-lg border" />
              <a href={qrUrl} download="qrcode.png"><Button variant="outline"><Download className="h-4 w-4 mr-2" />Download</Button></a>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default QrCodeGenerator;
