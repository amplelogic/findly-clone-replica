import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type SchemaType = "Organization" | "LocalBusiness" | "Article" | "Product" | "FAQ" | "BreadcrumbList";

const SchemaMarkupGenerator = () => {
  const [schemaType, setSchemaType] = useState<SchemaType>("Organization");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const generateSchema = () => {
    const base = {
      "@context": "https://schema.org",
      "@type": schemaType,
    };

    switch (schemaType) {
      case "Organization":
        return {
          ...base,
          name: formData.name || "",
          url: formData.url || "",
          logo: formData.logo || "",
          description: formData.description || "",
          sameAs: formData.socialLinks?.split("\n").filter(Boolean) || [],
        };
      case "LocalBusiness":
        return {
          ...base,
          name: formData.name || "",
          url: formData.url || "",
          telephone: formData.phone || "",
          address: {
            "@type": "PostalAddress",
            streetAddress: formData.street || "",
            addressLocality: formData.city || "",
            addressRegion: formData.state || "",
            postalCode: formData.zip || "",
            addressCountry: formData.country || "",
          },
        };
      case "Article":
        return {
          ...base,
          headline: formData.headline || "",
          author: {
            "@type": "Person",
            name: formData.author || "",
          },
          datePublished: formData.datePublished || "",
          dateModified: formData.dateModified || "",
          image: formData.image || "",
          publisher: {
            "@type": "Organization",
            name: formData.publisherName || "",
            logo: {
              "@type": "ImageObject",
              url: formData.publisherLogo || "",
            },
          },
        };
      case "Product":
        return {
          ...base,
          name: formData.name || "",
          description: formData.description || "",
          image: formData.image || "",
          brand: {
            "@type": "Brand",
            name: formData.brand || "",
          },
          offers: {
            "@type": "Offer",
            price: formData.price || "",
            priceCurrency: formData.currency || "USD",
            availability: formData.availability || "https://schema.org/InStock",
          },
        };
      case "FAQ":
        const faqItems = formData.faqs?.split("\n\n").map(item => {
          const [question, answer] = item.split("\n");
          return {
            "@type": "Question",
            name: question || "",
            acceptedAnswer: {
              "@type": "Answer",
              text: answer || "",
            },
          };
        }) || [];
        return {
          ...base,
          mainEntity: faqItems,
        };
      case "BreadcrumbList":
        const items = formData.breadcrumbs?.split("\n").map((item, index) => {
          const [name, url] = item.split("|");
          return {
            "@type": "ListItem",
            position: index + 1,
            name: name?.trim() || "",
            item: url?.trim() || "",
          };
        }) || [];
        return {
          ...base,
          itemListElement: items,
        };
      default:
        return base;
    }
  };

  const schemaJson = JSON.stringify(generateSchema(), null, 2);

  const copyToClipboard = () => {
    const scriptTag = `<script type="application/ld+json">\n${schemaJson}\n</script>`;
    navigator.clipboard.writeText(scriptTag);
    toast.success("Copied to clipboard!");
  };

  const renderFields = () => {
    switch (schemaType) {
      case "Organization":
        return (
          <>
            <div><Label>Organization Name</Label><Input placeholder="Your Company" value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></div>
            <div><Label>Website URL</Label><Input placeholder="https://example.com" value={formData.url || ""} onChange={(e) => updateField("url", e.target.value)} /></div>
            <div><Label>Logo URL</Label><Input placeholder="https://example.com/logo.png" value={formData.logo || ""} onChange={(e) => updateField("logo", e.target.value)} /></div>
            <div><Label>Description</Label><Textarea placeholder="Company description" value={formData.description || ""} onChange={(e) => updateField("description", e.target.value)} /></div>
            <div><Label>Social Links (one per line)</Label><Textarea placeholder="https://twitter.com/company" value={formData.socialLinks || ""} onChange={(e) => updateField("socialLinks", e.target.value)} /></div>
          </>
        );
      case "LocalBusiness":
        return (
          <>
            <div><Label>Business Name</Label><Input placeholder="Your Business" value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></div>
            <div><Label>Website URL</Label><Input placeholder="https://example.com" value={formData.url || ""} onChange={(e) => updateField("url", e.target.value)} /></div>
            <div><Label>Phone</Label><Input placeholder="+1-555-555-5555" value={formData.phone || ""} onChange={(e) => updateField("phone", e.target.value)} /></div>
            <div><Label>Street Address</Label><Input placeholder="123 Main St" value={formData.street || ""} onChange={(e) => updateField("street", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>City</Label><Input placeholder="New York" value={formData.city || ""} onChange={(e) => updateField("city", e.target.value)} /></div>
              <div><Label>State</Label><Input placeholder="NY" value={formData.state || ""} onChange={(e) => updateField("state", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>ZIP Code</Label><Input placeholder="10001" value={formData.zip || ""} onChange={(e) => updateField("zip", e.target.value)} /></div>
              <div><Label>Country</Label><Input placeholder="US" value={formData.country || ""} onChange={(e) => updateField("country", e.target.value)} /></div>
            </div>
          </>
        );
      case "Article":
        return (
          <>
            <div><Label>Headline</Label><Input placeholder="Article Title" value={formData.headline || ""} onChange={(e) => updateField("headline", e.target.value)} /></div>
            <div><Label>Author Name</Label><Input placeholder="John Doe" value={formData.author || ""} onChange={(e) => updateField("author", e.target.value)} /></div>
            <div><Label>Date Published</Label><Input type="date" value={formData.datePublished || ""} onChange={(e) => updateField("datePublished", e.target.value)} /></div>
            <div><Label>Date Modified</Label><Input type="date" value={formData.dateModified || ""} onChange={(e) => updateField("dateModified", e.target.value)} /></div>
            <div><Label>Featured Image URL</Label><Input placeholder="https://example.com/image.jpg" value={formData.image || ""} onChange={(e) => updateField("image", e.target.value)} /></div>
            <div><Label>Publisher Name</Label><Input placeholder="Company Name" value={formData.publisherName || ""} onChange={(e) => updateField("publisherName", e.target.value)} /></div>
            <div><Label>Publisher Logo URL</Label><Input placeholder="https://example.com/logo.png" value={formData.publisherLogo || ""} onChange={(e) => updateField("publisherLogo", e.target.value)} /></div>
          </>
        );
      case "Product":
        return (
          <>
            <div><Label>Product Name</Label><Input placeholder="Product Name" value={formData.name || ""} onChange={(e) => updateField("name", e.target.value)} /></div>
            <div><Label>Description</Label><Textarea placeholder="Product description" value={formData.description || ""} onChange={(e) => updateField("description", e.target.value)} /></div>
            <div><Label>Image URL</Label><Input placeholder="https://example.com/product.jpg" value={formData.image || ""} onChange={(e) => updateField("image", e.target.value)} /></div>
            <div><Label>Brand</Label><Input placeholder="Brand Name" value={formData.brand || ""} onChange={(e) => updateField("brand", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Price</Label><Input placeholder="99.99" value={formData.price || ""} onChange={(e) => updateField("price", e.target.value)} /></div>
              <div><Label>Currency</Label><Input placeholder="USD" value={formData.currency || ""} onChange={(e) => updateField("currency", e.target.value)} /></div>
            </div>
          </>
        );
      case "FAQ":
        return (
          <div>
            <Label>FAQs (Question on line 1, Answer on line 2, blank line between)</Label>
            <Textarea
              placeholder="What is your return policy?&#10;We offer 30-day returns.&#10;&#10;Do you ship internationally?&#10;Yes, we ship worldwide."
              value={formData.faqs || ""}
              onChange={(e) => updateField("faqs", e.target.value)}
              rows={10}
            />
          </div>
        );
      case "BreadcrumbList":
        return (
          <div>
            <Label>Breadcrumbs (Name|URL, one per line)</Label>
            <Textarea
              placeholder="Home|https://example.com&#10;Products|https://example.com/products&#10;Shoes|https://example.com/products/shoes"
              value={formData.breadcrumbs || ""}
              onChange={(e) => updateField("breadcrumbs", e.target.value)}
              rows={6}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ToolPageLayout
      title="Schema Markup Generator"
      description="Create structured data markup to enhance your search engine listings with rich snippets."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schema Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={schemaType} onValueChange={(v) => { setSchemaType(v as SchemaType); setFormData({}); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Organization">Organization</SelectItem>
                  <SelectItem value="LocalBusiness">Local Business</SelectItem>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="FAQ">FAQ</SelectItem>
                  <SelectItem value="BreadcrumbList">Breadcrumb List</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{schemaType} Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderFields()}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Generated Schema Markup</CardTitle>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                Copy with Script Tag
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                {schemaJson}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default SchemaMarkupGenerator;
