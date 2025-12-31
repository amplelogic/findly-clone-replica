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
import { 
  ExternalLink, Home, ChevronRight, Sparkles, FileText, TrendingUp, Bookmark,
  Check, Users, HelpCircle, Youtube, Tag
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
    
    // First try to find by slug if provided
    if (slug) {
      const { data: slugData } = await supabase
        .from("tools")
        .select("*")
        .eq("slug", slug)
        .single();
      data = slugData;
    }
    
    // Fallback to ID if slug not found or not provided
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

    // Parse FAQs if stored as JSON
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CategorySidebar />
        
        <main className="flex-1 w-full flex flex-col">
          <Header user={user} />

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
                {/* Main Info Card */}
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
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleSaveClick}
                        >
                          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                        </Button>
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
                    </div>

                    {/* Tags */}
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {tool.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

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
                  </CardContent>
                </Card>

                {/* Overview Section */}
                {tool.overview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
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

                {/* Features Section */}
                {tool.features && tool.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Use Cases Section */}
                {tool.use_cases && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
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

                {/* Best For Section */}
                {tool.best_for && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
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
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Frequently Asked Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`faq-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
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
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-500" />
                        Video Tutorials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.youtube_tutorials.map((url, index) => {
                          const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
                          if (!videoId) return null;
                          return (
                            <div key={index} className="aspect-video rounded-lg overflow-hidden">
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
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Other tools in {tool.category}
                    </h2>
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
                            badge={relatedTool.badge as "New" | "Deal" | "Popular" | "Free" | undefined}
                            isSaved={savedTools.has(relatedTool.id)}
                            onSaveToggle={() => {
                              setSavedTools(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(relatedTool.id)) {
                                  newSet.delete(relatedTool.id);
                                } else {
                                  newSet.add(relatedTool.id);
                                }
                                return newSet;
                              });
                            }}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
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
                          Get maximum visibility with a sponsor spot.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Submit Your Tool
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      Get featured on Marketing Tools
                    </p>
                    <Link to="/submit">
                      <Button className="w-full" size="sm">
                        Submit Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      SEO Growth Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      Get a dedicated SEO article
                    </p>
                    <Button variant="outline" className="w-full bg-primary/5 border-primary/20 text-primary hover:bg-primary/10" size="sm">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ToolDetail;
