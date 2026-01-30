import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ToolLogo } from "@/components/ToolLogo";
import { 
  ExternalLink, Home, ChevronRight, Bookmark, Check, Globe, Youtube as YoutubeIcon,
  ChevronDown, ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

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
  slug: string | null;
  tags: string[] | null;
  overview: string | null;
  use_cases: string | null;
  best_for: string | null;
  faqs: any;
  youtube_tutorials: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
}

const ToolDetail = () => {
  const { id, category: categorySlug, slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchTool();
  }, [id, slug]);

  useEffect(() => {
    if (user && tool) {
      checkIfSaved();
    }
  }, [user, tool]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const checkIfSaved = async () => {
    if (!user || !tool) return;
    const { data } = await supabase
      .from("saved_tools")
      .select("id")
      .eq("user_id", user.id)
      .eq("tool_id", tool.id)
      .maybeSingle();
    
    setIsSaved(!!data);
  };

  const fetchTool = async () => {
    let data: Tool | null = null;
    
    if (slug) {
      const { data: slugData } = await supabase
        .from("tools")
        .select("*")
        .eq("slug", slug)
        .single();
      data = slugData;
    }
    
    if (!data && id) {
      const { data: idData } = await supabase
        .from("tools")
        .select("*")
        .eq("id", id)
        .single();
      data = idData;
    }

    if (!data) {
      navigate("/");
      return;
    }

    if (data.faqs && typeof data.faqs === 'string') {
      try {
        data.faqs = JSON.parse(data.faqs);
      } catch {
        data.faqs = [];
      }
    }

    setTool(data);

    if (data.category) {
      const { data: related } = await supabase
        .from("tools")
        .select("*")
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(4);

      if (related) {
        setRelatedTools(related);
      }
    }

    setLoading(false);
  };

  const handleSaveClick = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to save tools.",
      });
      navigate("/auth");
      return;
    }

    if (!tool) return;

    try {
      if (isSaved) {
        await supabase
          .from("saved_tools")
          .delete()
          .eq("user_id", user.id)
          .eq("tool_id", tool.id);
        setIsSaved(false);
        toast({ title: "Tool removed from saved" });
      } else {
        await supabase
          .from("saved_tools")
          .insert({ user_id: user.id, tool_id: tool.id });
        setIsSaved(true);
        toast({ title: "Tool saved!" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tool.",
        variant: "destructive",
      });
    }
  };

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          <main className="flex-1 flex flex-col">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <Skeleton className="h-6 w-48 mb-6" />
              <Skeleton className="h-10 w-64 mb-8" />
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="w-16 h-16 rounded-xl" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!tool) return null;

  const faqs = Array.isArray(tool.faqs) ? tool.faqs : [];
  const displayedFeatures = showAllFeatures ? tool.features : tool.features?.slice(0, 3);

  return (
    <>
      <SEOHead
        title={tool.seo_title || `${tool.name} - ${tool.category || 'Marketing Tool'} | Marketing.Tools`}
        description={tool.seo_description || tool.description}
      />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          
          <main className="flex-1 w-full flex flex-col">
            <Header user={user} showSidebarTrigger />

            {/* Breadcrumb */}
            <div className="border-b border-border/50">
              <div className="container mx-auto px-4 py-3 max-w-6xl">
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link to="/tools" className="hover:text-foreground transition-colors">Tools</Link>
                  {tool.category && (
                    <>
                      <ChevronRight className="h-3.5 w-3.5" />
                      <Link 
                        to={`/categories/${getCategorySlug(tool.category)}`}
                        className="hover:text-foreground transition-colors"
                      >
                        {tool.category}
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>

            {/* Page Title */}
            <div className="container mx-auto px-4 pt-6 pb-4 max-w-6xl">
              <h1 className="text-2xl font-bold text-foreground">{tool.name} Review</h1>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 pb-12 max-w-6xl flex-1">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Hero Card */}
                  <Card className="overflow-hidden border-border/60">
                    <CardContent className="p-6">
                      {/* Tool Header */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex items-center gap-4">
                          <ToolLogo logo={tool.logo} name={tool.name} size="lg" />
                          <div>
                            <div className="flex items-center gap-2.5 mb-1">
                              <h2 className="text-xl font-semibold text-foreground">{tool.name}</h2>
                              {tool.badge && (
                                <Badge 
                                  variant="outline"
                                  className="text-xs font-medium border-primary/30 text-primary bg-primary/5"
                                >
                                  {tool.badge}
                                </Badge>
                              )}
                            </div>
                            {tool.category && (
                              <p className="text-sm text-muted-foreground">{tool.category}</p>
                            )}
                          </div>
                        </div>
                        {tool.website_url && (
                          <Button asChild size="sm" className="shrink-0">
                            <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4 mr-1.5" />
                              Get {tool.name}
                            </a>
                          </Button>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed mb-5">
                        {tool.description}
                      </p>

                      {/* Category Tags */}
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tool.tags.slice(0, 5).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs font-normal bg-muted/80 hover:bg-muted cursor-default"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {tool.tags.length > 5 && (
                            <Badge variant="secondary" className="text-xs font-normal">
                              +{tool.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* What is [Tool] Section */}
                  {tool.overview && (
                    <Card className="border-border/60">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          What is {tool.name}
                        </h3>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {tool.overview}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Use Cases Section */}
                  {tool.use_cases && (
                    <Card className="border-border/60">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Use Cases
                        </h3>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {tool.use_cases}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Video Tutorial */}
                  {tool.youtube_tutorials && tool.youtube_tutorials.length > 0 && (
                    <Card className="border-border/60 overflow-hidden">
                      <CardContent className="p-0">
                        {tool.youtube_tutorials.slice(0, 1).map((url, index) => {
                          const videoId = url.includes('youtube.com/watch?v=') 
                            ? url.split('v=')[1]?.split('&')[0]
                            : url.includes('youtu.be/')
                            ? url.split('youtu.be/')[1]?.split('?')[0]
                            : null;
                          
                          if (!videoId) return null;
                          
                          return (
                            <div key={index} className="aspect-video">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`${tool.name} Tutorial`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              />
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}

                  {/* FAQs Section */}
                  {faqs.length > 0 && (
                    <Card className="border-border/60">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Frequently Asked Questions
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                          {faqs.map((faq: FAQ, index: number) => (
                            <AccordionItem key={index} value={`faq-${index}`} className="border-border/60">
                              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground text-sm pb-4">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  )}

                  {/* Related Tools / Alternatives */}
                  {relatedTools.length > 0 && (
                    <Card className="border-border/60">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          What are {tool.name} alternatives?
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {relatedTools.map((relatedTool) => (
                            <Link
                              key={relatedTool.id}
                              to={relatedTool.category && relatedTool.slug 
                                ? `/${getCategorySlug(relatedTool.category)}/${relatedTool.slug}` 
                                : `/tool/${relatedTool.id}`
                              }
                              className="flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-muted/30 transition-all"
                            >
                              <ToolLogo logo={relatedTool.logo} name={relatedTool.name} size="md" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground text-sm mb-1">{relatedTool.name}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">{relatedTool.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-4">
                  {/* Core Capabilities */}
                  {tool.features && tool.features.length > 0 && (
                    <Card className="border-border/60">
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-foreground text-sm mb-4">
                          {tool.name} Core Capabilities
                        </h4>
                        <ul className="space-y-2.5">
                          {displayedFeatures?.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                              <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {tool.features.length > 3 && (
                          <button
                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                            className="flex items-center gap-1 text-sm text-primary hover:underline mt-3 font-medium"
                          >
                            {showAllFeatures ? (
                              <>Show Less <ChevronUp className="h-4 w-4" /></>
                            ) : (
                              <>Show More <ChevronDown className="h-4 w-4" /></>
                            )}
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Links */}
                  <Card className="border-border/60">
                    <CardContent className="p-5">
                      <h4 className="font-semibold text-foreground text-sm mb-3">Links</h4>
                      {tool.website_url && (
                        <a
                          href={tool.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          Visit Website
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pricing */}
                  {tool.pricing && (
                    <Card className="border-border/60">
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-foreground text-sm mb-3">Pricing</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">From</span>
                            <span className="font-medium text-foreground">{tool.pricing}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Who is it for */}
                  {tool.best_for && (
                    <Card className="border-border/60">
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-foreground text-sm mb-3">
                          Who is {tool.name} for?
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tool.best_for}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Save Tool CTA */}
                  <Card className="border-border/60 bg-muted/30">
                    <CardContent className="p-5">
                      <Button 
                        variant={isSaved ? "secondary" : "outline"}
                        className="w-full"
                        onClick={handleSaveClick}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                        {isSaved ? 'Saved to Collection' : 'Save for Later'}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* More Videos */}
                  {tool.youtube_tutorials && tool.youtube_tutorials.length > 1 && (
                    <Card className="border-border/60">
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                          <YoutubeIcon className="h-4 w-4 text-red-500" />
                          More Videos
                        </h4>
                        <div className="space-y-2">
                          {tool.youtube_tutorials.slice(1, 4).map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Tutorial {index + 2}
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default ToolDetail;
