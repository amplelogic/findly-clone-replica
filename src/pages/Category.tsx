import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ToolCard } from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/ToolCardSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  badge: string | null;
  category: string | null;
}

const TOOLS_PER_PAGE = 60;

const Category = () => {
  const { category } = useParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(TOOLS_PER_PAGE);

  useEffect(() => {
    checkAuth();
    fetchTools();
  }, [category]);

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
    setLoading(true);
    
    let query = supabase.from("tools").select("*");
    
    if (category && category !== "all") {
      query = query.ilike("category", `%${category.replace(/-/g, " ")}%`);
    }

    const { data, error } = await query;

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
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const categoryName = category
    ? category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : "All Tools";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CategorySidebar />
        
        <main className="flex-1 w-full flex flex-col">
          <header className="border-b border-border bg-card sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <SidebarTrigger className="lg:hidden" />
                  <Link to="/">
                    <div className="bg-foreground text-background px-2 py-0.5 sm:px-2.5 sm:py-1 rounded font-bold text-xs">
                      MARKETING.TOOLS
                    </div>
                  </Link>
                  <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-accent/10 rounded text-xs font-medium text-accent-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    CERTIFIED DOMAIN RATING
                  </div>
                </div>
                {user ? (
                  <Link to="/admin">
                    <Button variant="ghost" className="text-xs">
                      Admin
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button variant="ghost" className="text-xs">
                      Sign in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </header>

          <section className="container mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Find the best tools for you.
            </p>
            <div className="w-full sm:w-64">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Search tools by name..."
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
                {searchQuery ? "No tools match your search." : "No tools found in this category."}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {displayedTools.map((tool) => (
                    <Link key={tool.id} to={`/tool/${tool.id}`}>
                      <ToolCard
                        id={tool.id}
                        name={tool.name}
                        description={tool.description}
                        logo={tool.logo}
                        badge={tool.badge as "New" | "Deal" | undefined}
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
  );
};

export default Category;
