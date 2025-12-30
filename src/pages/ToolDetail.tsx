import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Home, ChevronRight, Sparkles, FileText, TrendingUp } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";

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
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
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

    // Fetch related tools from same category
    if (data.category) {
      const { data: related } = await supabase
        .from("tools")
        .select("*")
        .eq("category", data.category)
        .neq("id", id)
        .limit(6);

      if (related) {
        setRelatedTools(related);
      }
    }

    setLoading(false);
  };

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!tool) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            {tool.category && (
              <>
                <Link 
                  to={`/categories/${getCategorySlug(tool.category)}`} 
                  className="hover:text-foreground transition-colors"
                >
                  {tool.category}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tool Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                      <span className="text-3xl font-bold text-foreground">{tool.logo}</span>
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-foreground">{tool.name}</h1>
                      {tool.category && (
                        <p className="text-sm text-muted-foreground">{tool.category}</p>
                      )}
                    </div>
                  </div>
                  {tool.website_url && (
                    <Button asChild variant="outline">
                      <a
                        href={tool.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        Visit
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>

                {tool.pricing && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Pricing:</span>
                    <span className="text-sm px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      {tool.pricing}
                    </span>
                  </div>
                )}

                {tool.features && tool.features.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {tool.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Other tools in {tool.category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedTools.map((relatedTool) => (
                    <Link key={relatedTool.id} to={`/tool/${relatedTool.id}`}>
                      <ToolCard
                        name={relatedTool.name}
                        description={relatedTool.description}
                        logo={relatedTool.logo}
                        badge={relatedTool.badge as "New" | "Deal" | "Popular" | "Free" | undefined}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Sponsor Spot */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-2">Sponsor this spot</p>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">Your Tool Here</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get maximum visibility with a sponsor spot. Shown on every tool page sidebar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Your Tool */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Submit Your Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground mb-3">
                  Get featured on Findly Tools and reach thousands of potential users
                </p>
                <Button className="w-full" size="sm">
                  Submit Now
                </Button>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    Dofollow backlinks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    Lifetime listing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    Starting from $0
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* SEO Growth Package */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  SEO Growth Package
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-xs text-muted-foreground mb-3">
                  Get a dedicated SEO article and rank for "{tool.name}" review
                </p>
                <Button variant="outline" className="w-full bg-primary/5 border-primary/20 text-primary hover:bg-primary/10" size="sm">
                  Learn More
                </Button>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    Custom SEO article
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    Google ranking strategy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    Long-term traffic
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolDetail;