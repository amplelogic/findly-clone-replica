import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  badge: string | null;
  category: string | null;
  website_url: string | null;
  features: string[] | null;
  pricing: string | null;
}

const ToolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTool();
  }, [id]);

  const fetchTool = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      navigate("/");
      return;
    }

    setTool(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (!tool) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-3">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="text-4xl font-bold text-foreground">{tool.logo}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{tool.name}</h1>
                  {tool.badge && (
                    <Badge
                      variant={tool.badge === "New" ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                {tool.category && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Category: {tool.category}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {tool.pricing && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Pricing</h2>
                  <p className="text-muted-foreground">{tool.pricing}</p>
                </div>
              )}

              {tool.features && tool.features.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Features</h2>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {tool.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {tool.website_url && (
                <div>
                  <Button asChild>
                    <a
                      href={tool.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ToolDetail;