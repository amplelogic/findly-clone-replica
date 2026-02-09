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
import { User, Heart } from "lucide-react";

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
}

const Index = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(TOOLS_PER_PAGE);

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
    if (!searchQuery.trim()) return tools;
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      (tool.category && tool.category.toLowerCase().includes(query)) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [tools, searchQuery]);

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
  const newestTools = filteredTools;

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
            <section className="relative px-6 py-12 overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-border rounded-full text-xs font-medium text-muted-foreground mb-6">
                  <span className="text-foreground font-semibold">DR 75</span>
                  <span>CERTIFIED DOMAIN RATING</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  The best tools, all in one place.
                </h1>
                <p className="text-muted-foreground mb-8">
                  Discover {tools.length}+ quality tools for your next project.
                </p>
                
                <div className="max-w-md mx-auto mb-6">
                  <SearchBar 
                    value={searchQuery} 
                    onChange={setSearchQuery} 
                  />
                </div>
                
                <Link to="/submit">
                  <Button className="mb-6">
                    Submit your tool
                  </Button>
                </Link>
                
                <div className="flex items-center justify-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
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
                <h2 className="text-xl font-semibold text-foreground mb-6">Featured Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {featuredTools.map((tool) => (
                    <Link 
                      key={tool.id}
                      to={tool.category && tool.slug 
                        ? `/${getCategorySlug(tool.category)}/${tool.slug}` 
                        : `/tool/${tool.id}`
                      }
                      className="group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-border overflow-hidden mb-3 group-hover:border-primary/30 transition-colors">
                        {tool.logo && (
                          <img 
                            src={tool.logo} 
                            alt={tool.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Newest Additions */}
            <section className="px-6 pb-12 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-foreground">Newest Additions</h2>
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                  New
                </span>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <ToolCardSkeleton key={i} />
                  ))}
                </div>
              ) : newestTools.length === 0 ? (
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
