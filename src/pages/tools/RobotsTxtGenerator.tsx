import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Copy, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Rule {
  userAgent: string;
  disallow: string[];
  allow: string[];
}

const RobotsTxtGenerator = () => {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [rules, setRules] = useState<Rule[]>([
    { userAgent: "*", disallow: ["/admin/", "/private/"], allow: [] }
  ]);
  const [blockAiBots, setBlockAiBots] = useState(false);

  const addRule = () => {
    setRules([...rules, { userAgent: "", disallow: [], allow: [] }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: keyof Rule, value: string | string[]) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const generateRobotsTxt = () => {
    let content = "";

    rules.forEach(rule => {
      content += `User-agent: ${rule.userAgent || "*"}\n`;
      rule.disallow.forEach(path => {
        if (path.trim()) content += `Disallow: ${path.trim()}\n`;
      });
      rule.allow.forEach(path => {
        if (path.trim()) content += `Allow: ${path.trim()}\n`;
      });
      if (crawlDelay) content += `Crawl-delay: ${crawlDelay}\n`;
      content += "\n";
    });

    if (blockAiBots) {
      const aiBots = ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web", "Google-Extended"];
      aiBots.forEach(bot => {
        content += `User-agent: ${bot}\nDisallow: /\n\n`;
      });
    }

    if (sitemapUrl) {
      content += `Sitemap: ${sitemapUrl}\n`;
    }

    return content;
  };

  const robotsTxt = generateRobotsTxt();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(robotsTxt);
    toast.success("Copied to clipboard!");
  };

  const downloadFile = () => {
    const blob = new Blob([robotsTxt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <ToolPageLayout
      title="Robots.txt Generator"
      description="Generate a robots.txt file to control how search engines crawl your website."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sitemap">Sitemap URL</Label>
                <Input
                  id="sitemap"
                  placeholder="https://example.com/sitemap.xml"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="crawlDelay">Crawl Delay (seconds)</Label>
                <Input
                  id="crawlDelay"
                  type="number"
                  placeholder="10"
                  value={crawlDelay}
                  onChange={(e) => setCrawlDelay(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="blockAi">Block AI Bots (GPTBot, Claude, etc.)</Label>
                <Switch
                  id="blockAi"
                  checked={blockAiBots}
                  onCheckedChange={setBlockAiBots}
                />
              </div>
            </CardContent>
          </Card>

          {rules.map((rule, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Rule {index + 1}</CardTitle>
                {rules.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeRule(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>User-Agent</Label>
                  <Input
                    placeholder="* (all bots)"
                    value={rule.userAgent}
                    onChange={(e) => updateRule(index, "userAgent", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Disallow Paths (one per line)</Label>
                  <Textarea
                    placeholder="/admin/&#10;/private/"
                    value={rule.disallow.join("\n")}
                    onChange={(e) => updateRule(index, "disallow", e.target.value.split("\n"))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Allow Paths (one per line)</Label>
                  <Textarea
                    placeholder="/public/"
                    value={rule.allow.join("\n")}
                    onChange={(e) => updateRule(index, "allow", e.target.value.split("\n"))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addRule} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Generated robots.txt</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadFile}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                {robotsTxt || "# Your robots.txt will appear here"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default RobotsTxtGenerator;
