import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { format } from "date-fns";
import { SEOHead } from "@/components/SEOHead";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  return (
    <>
      <SEOHead
        title="Marketing Tools Blog - Tips, Guides & Insights"
        description="Read the latest articles about marketing tools, digital marketing strategies, SEO tips, and more. Stay updated with Marketing.Tools blog."
      />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          
          <main className="flex-1 w-full flex flex-col">
            <header className="border-b border-border bg-card sticky top-0 z-10">
              <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="lg:hidden" />
                    <Link to="/">
                      <div className="bg-foreground text-background px-2.5 py-1 rounded font-bold text-xs">
                        MARKETING.TOOLS
                      </div>
                    </Link>
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
                Blog
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                Latest articles and insights about digital marketing tools.
              </p>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <p className="text-muted-foreground">No blog posts yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                        {post.featured_image && (
                          <div className="h-48 bg-secondary overflow-hidden">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-2">
                            {format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}
                          </p>
                          <h2 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Blog;
