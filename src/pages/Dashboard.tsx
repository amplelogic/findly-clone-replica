import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ToolCard } from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/ToolCardSkeleton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Bookmark, Send, Clock } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  badge: string | null;
  category: string | null;
  slug: string | null;
}

interface Submission {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedToolIds, setSavedToolIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedTools();
      fetchSubmissions();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const fetchSavedTools = async () => {
    if (!user) return;
    
    const { data: savedData } = await supabase
      .from("saved_tools")
      .select("tool_id")
      .eq("user_id", user.id);

    if (savedData && savedData.length > 0) {
      const toolIds = savedData.map(s => s.tool_id);
      setSavedToolIds(new Set(toolIds));
      
      const { data: tools } = await supabase
        .from("tools")
        .select("*")
        .in("id", toolIds);

      if (tools) {
        setSavedTools(tools);
      }
    }
    setLoading(false);
  };

  const fetchSubmissions = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("submitted_tools")
      .select("id, name, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setSubmissions(data);
    }
  };

  const handleSaveToggle = async (toolId: string) => {
    if (!user) return;
    
    if (savedToolIds.has(toolId)) {
      await supabase
        .from("saved_tools")
        .delete()
        .eq("user_id", user.id)
        .eq("tool_id", toolId);
      
      setSavedToolIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
      setSavedTools(prev => prev.filter(t => t.id !== toolId));
    }
  };

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CategorySidebar />
        
        <main className="flex-1 w-full flex flex-col">
          <Header user={user} />

          <div className="container mx-auto px-4 sm:px-6 py-6 flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-6">My Dashboard</h1>
            
            <Tabs defaultValue="saved" className="space-y-6">
              <TabsList>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Saved Tools
                </TabsTrigger>
                <TabsTrigger value="submissions" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  My Submissions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[...Array(4)].map((_, i) => (
                      <ToolCardSkeleton key={i} />
                    ))}
                  </div>
                ) : savedTools.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No saved tools yet</h3>
                    <p className="text-muted-foreground mb-4">Start bookmarking tools to see them here</p>
                    <Link to="/">
                      <Button>Browse Tools</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {savedTools.map((tool) => (
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
                          isSaved={true}
                          onSaveToggle={() => handleSaveToggle(tool.id)}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="submissions">
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No submissions yet</h3>
                    <p className="text-muted-foreground mb-4">Submit your tool to get featured</p>
                    <Link to="/submit">
                      <Button>Submit a Tool</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => (
                      <div 
                        key={submission.id} 
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                      >
                        <div>
                          <h3 className="font-medium text-foreground">{submission.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          submission.status === 'approved' 
                            ? 'bg-green-500/10 text-green-600' 
                            : submission.status === 'rejected'
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
