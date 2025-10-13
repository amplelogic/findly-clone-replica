import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  badge: string | null;
  category: string | null;
}

const Category = () => {
  const { category } = useParams();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchTools();
  }, [category]);

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

  const categoryName = category
    ? category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : "All Tools";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CategorySidebar />
        
        <main className="flex-1 w-full">
          <header className="border-b border-border bg-card sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="bg-foreground text-background px-2 py-0.5 sm:px-2.5 sm:py-1 rounded font-bold text-xs">
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

          <section className="container mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Find the best tools for you.
            </p>
          </section>

          <section className="container mx-auto px-4 sm:px-6 pb-12">
            {loading ? (
              <p>Loading tools...</p>
            ) : tools.length === 0 ? (
              <p className="text-muted-foreground">No tools found in this category.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {tools.map((tool) => (
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Category;