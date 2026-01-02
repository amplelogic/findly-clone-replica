import { useState } from "react";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Globe, ExternalLink } from "lucide-react";

interface LocationPreset {
  name: string;
  country: string;
  code: string;
}

const locations: LocationPreset[] = [
  { name: "New York, US", country: "United States", code: "us" },
  { name: "Los Angeles, US", country: "United States", code: "us" },
  { name: "Chicago, US", country: "United States", code: "us" },
  { name: "London, UK", country: "United Kingdom", code: "uk" },
  { name: "Paris, France", country: "France", code: "fr" },
  { name: "Berlin, Germany", country: "Germany", code: "de" },
  { name: "Toronto, Canada", country: "Canada", code: "ca" },
  { name: "Sydney, Australia", country: "Australia", code: "au" },
  { name: "Tokyo, Japan", country: "Japan", code: "jp" },
  { name: "Mumbai, India", country: "India", code: "in" },
  { name: "São Paulo, Brazil", country: "Brazil", code: "br" },
  { name: "Mexico City, Mexico", country: "Mexico", code: "mx" },
];

const devices = [
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" },
];

const LocalSearchResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("desktop");
  const [searchUrl, setSearchUrl] = useState("");

  const generateSearchUrl = () => {
    if (!searchQuery) return;

    const location = locations.find(l => l.name === selectedLocation);
    const encodedQuery = encodeURIComponent(searchQuery);
    
    // Generate Google search URL with location parameters
    let url = `https://www.google.com/search?q=${encodedQuery}`;
    
    if (location) {
      // Add geographic location parameter
      url += `&gl=${location.code}`;
      url += `&uule=w+CAIQICI${btoa(location.name).replace(/=/g, '')}`;
    }

    setSearchUrl(url);
  };

  const openSearch = () => {
    if (searchUrl) {
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <ToolPageLayout
      title="Local Search Results Tool"
      description="Preview local search results for different geographic locations. See how your site ranks in different cities and countries."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="query">Search Query</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="query"
                    placeholder="Enter your search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc.name} value={loc.name}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {loc.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Device Type</Label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map(device => (
                      <SelectItem key={device.value} value={device.value}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateSearchUrl} className="flex-1" disabled={!searchQuery}>
                  Generate Search URL
                </Button>
              </div>
            </CardContent>
          </Card>

          {searchUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generated Search URL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-mono break-all">{searchUrl}</p>
                </div>
                <Button onClick={openSearch} className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Google
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Available Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {locations.map(loc => (
                  <button
                    key={loc.name}
                    onClick={() => setSelectedLocation(loc.name)}
                    className={`p-2 rounded-lg text-left text-sm transition-colors ${
                      selectedLocation === loc.name 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{loc.name}</span>
                    </div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {loc.code.toUpperCase()}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Enter the search query you want to test</li>
                <li>Select a geographic location</li>
                <li>Choose your device type</li>
                <li>Click "Generate Search URL"</li>
                <li>Open the URL to see localized results</li>
              </ol>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> This tool generates a Google search URL with location parameters. 
                  For more accurate results, consider using a VPN or proxy service in the target location.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Local SEO Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Optimize your Google Business Profile</li>
                <li>• Use location-specific keywords</li>
                <li>• Build local citations and backlinks</li>
                <li>• Encourage customer reviews</li>
                <li>• Create location-specific landing pages</li>
                <li>• Ensure NAP consistency across the web</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default LocalSearchResults;
