import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Binary, ArrowRightLeft } from "lucide-react";

const UrlEncoderDecoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("Invalid encoded string"); }};

  return (
    <ToolPageLayout title="URL Encoder/Decoder" description="Encode or decode URLs for safe transmission.">
      <Card className="border-border/50 max-w-2xl mx-auto">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Binary className="h-5 w-5 text-primary" />URL Encoder/Decoder
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to encode or decode..." rows={4} />
          <div className="flex gap-2">
            <Button onClick={encode} className="flex-1">Encode</Button>
            <Button onClick={decode} variant="outline" className="flex-1">Decode</Button>
          </div>
          {output && <Textarea value={output} readOnly rows={4} className="bg-muted/50" />}
        </CardContent>
      </Card>
    </ToolPageLayout>
  );
};

export default UrlEncoderDecoder;
