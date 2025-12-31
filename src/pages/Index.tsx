import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ToolCard } from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/ToolCardSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SEOHead } from "@/components/SEOHead";

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
          <Header user={user} />

          <section className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-1.5">
              The best tools, all in one place.
            </h1>
            <p className="text-sm text-muted-foreground mb-5">
              Find the best tools for you.
            </p>
            <div className="w-full sm:w-80">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
              />
            </div>
          </section>

          <section className="container mx-auto px-4 sm:px-6 pb-12 flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[...Array(12)].map((_, i) => (
                  <ToolCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredTools.length === 0 ? (
              <p className="text-muted-foreground">
                {searchQuery ? "No tools match your search." : "No tools found. Add some from the admin panel!"}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
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
