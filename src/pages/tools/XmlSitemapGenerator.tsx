import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UrlEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  hreflangs: { lang: string; url: string }[];
}

const XmlSitemapGenerator = () => {
  const [urls, setUrls] = useState<UrlEntry[]>([
    {
      loc: "https://example.com/",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "1.0",
      hreflangs: []
    }
  ]);
  const [includeHreflang, setIncludeHreflang] = useState(false);

  const addUrl = () => {
    setUrls([...urls, {
      loc: "",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.8",
      hreflangs: []
    }]);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, field: keyof UrlEntry, value: any) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
  };

  const addHreflang = (urlIndex: number) => {
    const newUrls = [...urls];
    newUrls[urlIndex].hreflangs.push({ lang: "en", url: "" });
    setUrls(newUrls);
  };

  const updateHreflang = (urlIndex: number, hreflangIndex: number, field: "lang" | "url", value: string) => {
    const newUrls = [...urls];
    newUrls[urlIndex].hreflangs[hreflangIndex][field] = value;
    setUrls(newUrls);
  };

  const removeHreflang = (urlIndex: number, hreflangIndex: number) => {
    const newUrls = [...urls];
    newUrls[urlIndex].hreflangs = newUrls[urlIndex].hreflangs.filter((_, i) => i !== hreflangIndex);
    setUrls(newUrls);
  };

  const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${includeHreflang ? '\n       xmlns:xhtml="http://www.w3.org/1999/xhtml"' : ''}>
`;

    urls.forEach(url => {
      if (!url.loc) return;
      
      xml += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
`;
      
      if (includeHreflang && url.hreflangs.length > 0) {
        url.hreflangs.forEach(hreflang => {
          if (hreflang.url) {
            xml += `    <xhtml:link rel="alternate" hreflang="${hreflang.lang}" href="${hreflang.url}"/>
`;
          }
        });
      }
      
      xml += `  </url>
`;
    });

    xml += `</urlset>`;
    return xml;
  };

  const sitemap = generateSitemap();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sitemap);
    toast.success("Copied to clipboard!");
  };

  const downloadFile = () => {
    const blob = new Blob([sitemap], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <ToolPageLayout
      title="XML Sitemap Generator"
      description="Generate XML sitemaps with hreflang support for multilingual and international websites."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Settings</CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="hreflang" className="text-sm">Include Hreflang</Label>
                  <Switch
                    id="hreflang"
                    checked={includeHreflang}
                    onCheckedChange={setIncludeHreflang}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          {urls.map((url, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">URL {index + 1}</CardTitle>
                {urls.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeUrl(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>URL</Label>
                  <Input
                    placeholder="https://example.com/page"
                    value={url.loc}
                    onChange={(e) => updateUrl(index, "loc", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Last Modified</Label>
                    <Input
                      type="date"
                      value={url.lastmod}
                      onChange={(e) => updateUrl(index, "lastmod", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Change Freq</Label>
                    <Select value={url.changefreq} onValueChange={(v) => updateUrl(index, "changefreq", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Always</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={url.priority} onValueChange={(v) => updateUrl(index, "priority", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.0">1.0</SelectItem>
                        <SelectItem value="0.9">0.9</SelectItem>
                        <SelectItem value="0.8">0.8</SelectItem>
                        <SelectItem value="0.7">0.7</SelectItem>
                        <SelectItem value="0.6">0.6</SelectItem>
                        <SelectItem value="0.5">0.5</SelectItem>
                        <SelectItem value="0.4">0.4</SelectItem>
                        <SelectItem value="0.3">0.3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {includeHreflang && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Hreflang Tags</Label>
                      <Button variant="ghost" size="sm" onClick={() => addHreflang(index)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    {url.hreflangs.map((hreflang, hi) => (
                      <div key={hi} className="flex gap-2 mb-2">
                        <Input
                          placeholder="en"
                          value={hreflang.lang}
                          onChange={(e) => updateHreflang(index, hi, "lang", e.target.value)}
                          className="w-20"
                        />
                        <Input
                          placeholder="https://example.com/en/"
                          value={hreflang.url}
                          onChange={(e) => updateHreflang(index, hi, "url", e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeHreflang(index, hi)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addUrl} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add URL
          </Button>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Generated Sitemap</CardTitle>
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
              <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                {sitemap}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default XmlSitemapGenerator;
