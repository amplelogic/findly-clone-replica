import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ToolCard } from "@/components/ToolCard";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";

const Index = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAuth();
    fetchTools();
  }, []);

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

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tools, searchQuery]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CategorySidebar />
        
        <main className="flex-1 w-full flex flex-col">
          <header className="border-b border-border bg-card sticky top-0 z-10">
            <div className="container mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="bg-foreground text-background px-2.5 py-1 rounded font-bold text-xs">
                    FINDLY.TOOLS
                  </div>
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

          <section className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-1.5">
              The best tools, all in one place.
            </h1>
            <p className="text-sm text-muted-foreground mb-5">
              Find the best tools for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-4 py-2">
                <Plus className="h-4 w-4 mr-2" />
                Submit tool
              </Button>
              <div className="w-full sm:w-64">
                <SearchBar 
                  value={searchQuery} 
                  onChange={setSearchQuery} 
                  placeholder="Search tools by name..."
                />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 sm:px-6 pb-12 flex-1">
            {loading ? (
              <p>Loading tools...</p>
            ) : filteredTools.length === 0 ? (
              <p className="text-muted-foreground">
                {searchQuery ? "No tools match your search." : "No tools found. Add some from the admin panel!"}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {filteredTools.map((tool) => (
                  <Link key={tool.id} to={`/tool/${tool.id}`}>
                    <ToolCard
                      name={tool.name}
                      description={tool.description}
                      logo={tool.logo}
                      badge={tool.badge as "New" | "Deal" | undefined}
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
