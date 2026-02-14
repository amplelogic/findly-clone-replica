import { useEffect, useState, useRef } from "react";
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
  ExternalLink, ChevronRight, Bookmark, Check, Globe, Youtube as YoutubeIcon,
  ChevronDown, ChevronUp, List, DollarSign, Users, Zap, HelpCircle, Layers, Video
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
  const [isSticky, setIsSticky] = useState(false);

  // Refs for scroll-to sections
  const overviewRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const bestForRef = useRef<HTMLDivElement>(null);
  const tutorialRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const alternativesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setIsSticky(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      const { data: slugData } = await supabase.from("tools").select("*").eq("slug", slug).single();
      data = slugData;
    }
    if (!data && id) {
      const { data: idData } = await supabase.from("tools").select("*").eq("id", id).single();
      data = idData;
    }
    if (!data) { navigate("/"); return; }
    if (data.faqs && typeof data.faqs === 'string') {
      try { data.faqs = JSON.parse(data.faqs); } catch { data.faqs = []; }
    }
    setTool(data);
    if (data.category) {
      const { data: related } = await supabase.from("tools").select("*").eq("category", data.category).neq("id", data.id).limit(4);
      if (related) setRelatedTools(related);
    }
    setLoading(false);
  };

  const handleSaveClick = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to save tools." });
      navigate("/auth");
      return;
    }
    if (!tool) return;
    try {
      if (isSaved) {
        await supabase.from("saved_tools").delete().eq("user_id", user.id).eq("tool_id", tool.id);
        setIsSaved(false);
        toast({ title: "Tool removed from saved" });
      } else {
        await supabase.from("saved_tools").insert({ user_id: user.id, tool_id: tool.id });
        setIsSaved(true);
        toast({ title: "Tool saved!" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save tool.", variant: "destructive" });
    }
  };

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          <main className="flex-1 flex flex-col">
            <div className="px-6 py-8">
              <Skeleton className="h-6 w-48 mb-6" />
              <Skeleton className="h-10 w-64 mb-8" />
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
                <div><Skeleton className="h-64 w-full rounded-xl" /></div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!tool) return null;

  const faqs = Array.isArray(tool.faqs) ? tool.faqs : [];
  const displayedFeatures = showAllFeatures ? tool.features : tool.features?.slice(0, 5);

  // Build "On this page" sections
  const tocSections = [
    ...(tool.overview ? [{ label: "Overview", ref: overviewRef, icon: <Layers className="h-3.5 w-3.5" /> }] : []),
    ...(tool.use_cases ? [{ label: "Use Cases", ref: useCasesRef, icon: <Zap className="h-3.5 w-3.5" /> }] : []),
    ...(tool.features?.length ? [{ label: "Core Capabilities", ref: capabilitiesRef, icon: <Check className="h-3.5 w-3.5" /> }] : []),
    ...(tool.best_for ? [{ label: "Who is it for?", ref: bestForRef, icon: <Users className="h-3.5 w-3.5" /> }] : []),
    ...(tool.youtube_tutorials?.length ? [{ label: "Video Tutorial", ref: tutorialRef, icon: <Video className="h-3.5 w-3.5" /> }] : []),
    ...(faqs.length > 0 ? [{ label: "FAQ", ref: faqRef, icon: <HelpCircle className="h-3.5 w-3.5" /> }] : []),
    ...(relatedTools.length > 0 ? [{ label: "Alternatives", ref: alternativesRef, icon: <List className="h-3.5 w-3.5" /> }] : []),
  ];

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
              <div className="px-6 py-3">
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
            <div className="px-6 pt-6 pb-4">
              <h1 className="text-2xl font-bold text-foreground">{tool.name} Review</h1>
            </div>

            {/* Main Content Grid */}
            <div className="px-6 pb-12 flex-1">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Hero Card */}
                  <Card ref={heroRef} className="overflow-hidden border-border/60 shadow-sm">
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
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant={isSaved ? "secondary" : "outline"}
                            size="sm"
                            onClick={handleSaveClick}
                          >
                            <Bookmark className={`h-4 w-4 mr-1.5 ${isSaved ? 'fill-current' : ''}`} />
                            {isSaved ? 'Saved' : 'Save'}
                          </Button>
                          {tool.website_url && (
                            <Button asChild size="sm">
                              <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 mr-1.5" />
                                Visit {tool.name}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {tool.description}
                      </p>

                      {/* Pricing inline */}
                      {tool.pricing && (
                        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/40 rounded-lg border border-border/50">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Pricing:</span>
                          <span className="text-sm text-muted-foreground">{tool.pricing}</span>
                        </div>
                      )}

                      {/* Tags */}
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tool.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs font-normal bg-muted/80 hover:bg-muted cursor-default"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* What is [Tool] Section */}
                  {tool.overview && (
                    <div ref={overviewRef} className="scroll-mt-20">
                      <Card className="border-border/60 shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-primary/60 to-purple-400/60" />
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            What is {tool.name}
                          </h3>
                          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {tool.overview}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Use Cases Section */}
                  {tool.use_cases && (
                    <div ref={useCasesRef} className="scroll-mt-20">
                      <Card className="border-border/60 shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-blue-500/60 to-cyan-400/60" />
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-500" />
                            Use Cases
                          </h3>
                          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {tool.use_cases}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Core Capabilities (moved from sidebar) */}
                  {tool.features && tool.features.length > 0 && (
                    <div ref={capabilitiesRef} className="scroll-mt-20">
                      <Card className="border-border/60 shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-green-500/60 to-emerald-400/60" />
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            {tool.name} Core Capabilities
                          </h3>
                          <ul className="grid sm:grid-cols-2 gap-3">
                            {displayedFeatures?.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30 border border-border/40">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          {tool.features.length > 5 && (
                            <button
                              onClick={() => setShowAllFeatures(!showAllFeatures)}
                              className="flex items-center gap-1 text-sm text-primary hover:underline mt-4 font-medium"
                            >
                              {showAllFeatures ? (
                                <>Show Less <ChevronUp className="h-4 w-4" /></>
                              ) : (
                                <>Show All ({tool.features.length}) <ChevronDown className="h-4 w-4" /></>
                              )}
                            </button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Who is it for (moved from sidebar) */}
                  {tool.best_for && (
                    <div ref={bestForRef} className="scroll-mt-20">
                      <Card className="border-border/60 shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-amber-500/60 to-orange-400/60" />
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-amber-500" />
                            Who is {tool.name} for?
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {tool.best_for}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Video Tutorial */}
                  {tool.youtube_tutorials && tool.youtube_tutorials.length > 0 && (
                    <div ref={tutorialRef} className="scroll-mt-20">
                      <Card className="border-border/60 shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-red-500/60 to-pink-400/60" />
                        <CardContent className="p-0">
                          <div className="p-6 pb-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <YoutubeIcon className="h-5 w-5 text-red-500" />
                              Video Tutorial
                            </h3>
                          </div>
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
                    </div>
                  )}

                  {/* FAQs Section */}
                  {faqs.length > 0 && (
                    <div ref={faqRef} className="scroll-mt-20">
                      <Card className="border-border/60 shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-violet-500/60 to-purple-400/60" />
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-violet-500" />
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
                    </div>
                  )}

                  {/* Related Tools / Alternatives */}
                  {relatedTools.length > 0 && (
                    <div ref={alternativesRef} className="scroll-mt-20">
                      <Card className="border-border/60 shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-teal-500/60 to-cyan-400/60" />
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <List className="h-5 w-5 text-teal-500" />
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
                    </div>
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-4">
                  {/* Sticky Tool Name + Visit (appears on scroll) */}
                  {isSticky && (
                    <div className="sticky top-16 z-10 bg-background border border-border/60 rounded-xl p-4 shadow-md animate-fade-in">
                      <div className="flex items-center gap-3 mb-3">
                        <ToolLogo logo={tool.logo} name={tool.name} size="sm" />
                        <h4 className="font-semibold text-foreground text-sm truncate">{tool.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={isSaved ? "secondary" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={handleSaveClick}
                        >
                          <Bookmark className={`h-3.5 w-3.5 mr-1 ${isSaved ? 'fill-current' : ''}`} />
                          {isSaved ? 'Saved' : 'Save'}
                        </Button>
                        {tool.website_url && (
                          <Button asChild size="sm" className="flex-1">
                            <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-3.5 w-3.5 mr-1" />
                              Visit
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* On this page */}
                  {tocSections.length > 0 && (
                    <Card className={`border-border/60 ${isSticky ? 'sticky top-52' : 'sticky top-20'}`}>
                      <CardContent className="p-5">
                        <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                          <List className="h-4 w-4 text-primary" />
                          On this page
                        </h4>
                        <nav className="space-y-1">
                          {tocSections.map((section) => (
                            <button
                              key={section.label}
                              onClick={() => scrollTo(section.ref)}
                              className="flex items-center gap-2 w-full text-left text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md px-2 py-1.5 transition-colors"
                            >
                              {section.icon}
                              {section.label}
                            </button>
                          ))}
                        </nav>
                      </CardContent>
                    </Card>
                  )}

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
