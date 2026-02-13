import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ToolCard } from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/ToolCardSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SEOHead } from "@/components/SEOHead";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Heart, Sparkles, ArrowRight, ExternalLink } from "lucide-react";

const TOOLS_PER_PAGE = 60;

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  badge: string | null;
  category: string | null;
  slug: string | null;
  tags: string[] | null;
  website_url: string | null;
}

const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(TOOLS_PER_PAGE);
  const [pricingFilter, setPricingFilter] = useState("all");

  useEffect(() => {
    checkAuth();
    fetchTools();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedTools();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTools(data);
    }
    setLoading(false);
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

  const filteredTools = useMemo(() => {
    let filtered = tools;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        (tool.category && tool.category.toLowerCase().includes(query)) ||
        (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    if (pricingFilter !== "all") {
      filtered = filtered.filter(tool => {
        const pricing = (tool as any).pricing?.toLowerCase() || "";
        switch (pricingFilter) {
          case "free": return pricing.includes("free") && !pricing.includes("freemium") && !pricing.includes("trial");
          case "paid": return pricing.includes("paid") || (pricing && !pricing.includes("free"));
          case "freemium": return pricing.includes("freemium");
          case "free-trial": return pricing.includes("trial");
          default: return true;
        }
      });
    }
    return filtered;
  }, [tools, searchQuery, pricingFilter]);

  const displayedTools = filteredTools.slice(0, displayCount);
  const hasMore = displayCount < filteredTools.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + TOOLS_PER_PAGE);
  };

  const handleSaveToggle = (toolId: string) => {
    setSavedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");
  };

  // Get featured tools (first 4 with badge)
  const featuredTools = tools.filter(t => t.badge).slice(0, 4);
  const allDisplayTools = filteredTools;

  return (
    <>
      <SEOHead
        title="Marketing.Tools - The Best Marketing Tools Directory"
        description="Discover the best marketing tools for SEO, social media, email marketing, analytics, and more. Find the perfect tools to grow your business."
        canonicalUrl="https://marketing.tools"
      />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          
          <main className="flex-1 w-full flex flex-col">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
              <Link to="/">
                <div className="bg-foreground text-background px-3 py-1.5 rounded font-bold text-sm">
                  MARKETING.TOOLS
                </div>
              </Link>
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <User className="h-4 w-4 mr-1.5" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Admin
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Sign in
                    </Button>
                  </Link>
                )}
              </div>
            </header>

            {/* Sponsor Banner */}
            <div className="px-6 py-3 border-b border-border">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">Your Tool Here</span> — Get maximum visibility with a sponsor spot on Marketing.tools
                  </span>
                </div>
                <Link to="/submit" className="text-primary hover:underline font-medium">
                  Sponsor this spot
                </Link>
              </div>
            </div>

            {/* Hero Section */}
            <section className="relative px-6 py-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/8 rounded-full blur-[100px] animate-pulse" />
              
              <div className="relative max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="font-semibold">DR 75</span>
                  <span className="text-primary/70">CERTIFIED DOMAIN RATING</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 tracking-tight whitespace-nowrap">
                  The best tools, <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent italic">all in one place.</span>
                </h1>
                <p className="text-muted-foreground text-base mb-6 max-w-lg mx-auto">
                  Discover {tools.length}+ quality marketing tools to grow your business faster.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  <Link to="/submit">
                    <Button size="lg" className="gap-2 px-6 shadow-lg shadow-primary/20">
                      Submit your tool
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/resources">
                    <Button variant="outline" size="lg" className="px-6">
                      Browse Resources
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Trusted by <span className="font-semibold text-foreground">1000+</span> makers
                  </span>
                </div>
              </div>
            </section>

            {/* Featured Tools */}
            {featuredTools.length > 0 && (
              <section className="px-6 py-8">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Featured Tools</h2>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                    ⭐ Featured
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {featuredTools.map((tool) => (
                    <Link 
                      key={tool.id}
                      to={tool.category && tool.slug 
                        ? `/${getCategorySlug(tool.category)}/${tool.slug}` 
                        : `/tool/${tool.id}`
                      }
                    >
                      <ToolCard
                        id={tool.id}
                        name={tool.name}
                        description={tool.description}
                        logo={tool.logo}
                        badge={tool.badge as "New" | "Deal" | "Popular" | "Free" | undefined}
                        category={tool.category}
                        websiteUrl={tool.website_url}
                        isSaved={savedTools.has(tool.id)}
                        onSaveToggle={() => handleSaveToggle(tool.id)}
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All Tools */}
            <section className="px-6 pb-12 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">All Tools</h2>
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                    {filteredTools.length}
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-64">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tools..." />
                  </div>
                  <Select value={pricingFilter} onValueChange={setPricingFilter}>
                    <SelectTrigger className="w-[130px] h-10 rounded-[5px] text-sm">
                      <SelectValue placeholder="Pricing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pricing</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="free-trial">Free Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <ToolCardSkeleton key={i} />
                  ))}
                </div>
              ) : allDisplayTools.length === 0 ? (
                <p className="text-muted-foreground">
                  {searchQuery ? "No tools match your search." : "No tools found. Add some from the admin panel!"}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {displayedTools.map((tool) => (
                      <Link 
                        key={tool.id} 
                        to={tool.category && tool.slug 
                          ? `/${getCategorySlug(tool.category)}/${tool.slug}` 
                          : `/tool/${tool.id}`
                        }
                      >
                        <ToolCard
                          id={tool.id}
                          name={tool.name}
                          description={tool.description}
                          logo={tool.logo}
                          badge={tool.badge as "New" | "Deal" | "Popular" | "Free" | undefined}
                          category={tool.category}
                          websiteUrl={tool.website_url}
                          isSaved={savedTools.has(tool.id)}
                          onSaveToggle={() => handleSaveToggle(tool.id)}
                        />
                      </Link>
                    ))}
                  </div>
                  {hasMore && (
                    <div className="flex justify-center mt-8">
                      <Button 
                        variant="outline" 
                        onClick={handleLoadMore}
                        className="px-8"
                      >
                        Load More ({filteredTools.length - displayCount} remaining)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </section>

            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Index;
