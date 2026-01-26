import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ToolLogo } from "@/components/ToolLogo";
import { 
  ExternalLink, Home, ChevronRight, FileText, TrendingUp, Bookmark,
  Check, Users, HelpCircle, Youtube, Tag, Star, Zap, Target, ArrowRight
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
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
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
    fetchTool();
  }, [id, slug]);

  useEffect(() => {
    if (user && tool) {
      checkIfSaved();
      fetchSavedTools();
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

  const fetchSavedTools = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("saved_tools")
      .select("tool_id")
      .eq("user_id", user.id);
    
    if (data) {
      setSavedTools(new Set(data.map(s => s.tool_id)));
    }
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
        .limit(6);

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
            <div className="container mx-auto px-6 py-8">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-8" />
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="w-14 h-14 rounded-xl" />
                    <div>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!tool) return null;

  const faqs = Array.isArray(tool.faqs) ? tool.faqs : [];
  const hasDetailedContent = tool.overview || (tool.features && tool.features.length > 0) || tool.use_cases || tool.best_for || faqs.length > 0;

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

            {/* Breadcrumb Navigation */}
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

            <div className="container mx-auto px-4 sm:px-6 py-6 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Hero Card with Tool Info */}
                  <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6 border-b">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <ToolLogo logo={tool.logo} name={tool.name} size="lg" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{tool.name}</h1>
                              {tool.badge && (
                                <Badge 
                                  variant={tool.badge === "New" ? "default" : "secondary"}
                                  className={
                                    tool.badge === "New" 
                                      ? "bg-primary text-primary-foreground" 
                                      : tool.badge === "Popular"
                                      ? "bg-amber-500/10 text-amber-600"
                                      : tool.badge === "Free"
                                      ? "bg-green-500/10 text-green-600"
                                      : ""
                                  }
                                >
                                  {tool.badge}
                                </Badge>
                              )}
                            </div>
                            {tool.category && (
                              <Link 
                                to={`/categories/${getCategorySlug(tool.category)}`}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {tool.category}
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleSaveClick}
                            className="h-9 w-9"
                          >
                            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                          </Button>
                          {tool.website_url && (
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
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {tool.description}
                      </p>

                      {/* Category Tags */}
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                          {tool.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs font-normal">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {tool.pricing && (
                      <Card className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Pricing</div>
                        <div className="font-semibold text-foreground">{tool.pricing}</div>
                      </Card>
                    )}
                    {tool.category && (
                      <Card className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Category</div>
                        <div className="font-semibold text-foreground text-sm">{tool.category}</div>
                      </Card>
                    )}
                    {tool.features && tool.features.length > 0 && (
                      <Card className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Features</div>
                        <div className="font-semibold text-foreground">{tool.features.length}+</div>
                      </Card>
                    )}
                    {tool.badge && (
                      <Card className="p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Status</div>
                        <div className="font-semibold text-primary">{tool.badge}</div>
                      </Card>
                    )}
                  </div>

                  {/* Overview Section */}
                  {tool.overview && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {tool.overview}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Key Features Section */}
                  {tool.features && tool.features.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <Zap className="h-4 w-4 text-green-600" />
                          </div>
                          Key Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tool.features.map((feature, index) => (
                            <div 
                              key={index} 
                              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="mt-0.5 p-1 rounded-full bg-green-500/10">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Real-world Use Cases Section */}
                  {tool.use_cases && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          Real-world Use Cases
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {tool.use_cases}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Who It's Best For Section */}
                  {tool.best_for && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-purple-500/10">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          Who It's Best For
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {tool.best_for}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* FAQs Section */}
                  {faqs.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-amber-500/10">
                            <HelpCircle className="h-4 w-4 text-amber-600" />
                          </div>
                          Frequently Asked Questions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`faq-${index}`} className="border-b last:border-0">
                              <AccordionTrigger className="text-left hover:no-underline py-4">
                                <span className="font-medium text-foreground">{faq.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground pb-4">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  )}

                  {/* YouTube Tutorials Section */}
                  {tool.youtube_tutorials && tool.youtube_tutorials.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-red-500/10">
                            <Youtube className="h-4 w-4 text-red-500" />
                          </div>
                          Video Tutorials
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tool.youtube_tutorials.map((url, index) => {
                            const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
                            if (!videoId) return null;
                            return (
                              <div key={index} className="aspect-video rounded-lg overflow-hidden border">
                                <iframe
                                  width="100%"
                                  height="100%"
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  title={`Tutorial ${index + 1}`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="border-0"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Related Tools */}
                  {relatedTools.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                          More {tool.category} Tools
                        </h2>
                        <Link 
                          to={`/categories/${getCategorySlug(tool.category!)}`}
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View all
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {relatedTools.map((relatedTool) => (
                          <Link 
                            key={relatedTool.id} 
                            to={relatedTool.category && relatedTool.slug 
                              ? `/${getCategorySlug(relatedTool.category)}/${relatedTool.slug}` 
                              : `/tool/${relatedTool.id}`
                            }
                          >
                            <ToolCard
                              id={relatedTool.id}
                              name={relatedTool.name}
                              description={relatedTool.description}
                              logo={relatedTool.logo}
                              badge={relatedTool.badge as any}
                              isSaved={savedTools.has(relatedTool.id)}
                              onSaveToggle={fetchSavedTools}
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* CTA Card */}
                  <Card className="sticky top-20">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <ToolLogo logo={tool.logo} name={tool.name} />
                        <div>
                          <h3 className="font-semibold text-foreground">{tool.name}</h3>
                          {tool.pricing && (
                            <span className="text-xs text-muted-foreground">{tool.pricing}</span>
                          )}
                        </div>
                      </div>
                      
                      {tool.website_url && (
                        <Button asChild className="w-full mb-3">
                          <a
                            href={tool.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2"
                          >
                            Try {tool.name}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleSaveClick}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                        {isSaved ? 'Saved' : 'Save for Later'}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Navigation */}
                  {hasDetailedContent && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">On this page</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <nav className="space-y-1">
                          {tool.overview && (
                            <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors py-1">
                              Overview
                            </a>
                          )}
                          {tool.features && tool.features.length > 0 && (
                            <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors py-1">
                              Key Features
                            </a>
                          )}
                          {tool.use_cases && (
                            <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors py-1">
                              Use Cases
                            </a>
                          )}
                          {tool.best_for && (
                            <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors py-1">
                              Best For
                            </a>
                          )}
                          {faqs.length > 0 && (
                            <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors py-1">
                              FAQs
                            </a>
                          )}
                          {tool.youtube_tutorials && tool.youtube_tutorials.length > 0 && (
                            <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors py-1">
                              Video Tutorials
                            </a>
                          )}
                        </nav>
                      </CardContent>
                    </Card>
                  )}

                  {/* Share Card */}
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">Share this tool</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast({ title: "Link copied!" });
                          }}
                        >
                          Copy Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
