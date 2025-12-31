import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight, Home } from "lucide-react";
import { format } from "date-fns";
import { SEOHead } from "@/components/SEOHead";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchPost();
  }, [slug]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchPost = async () => {
    if (!slug) return;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) {
      navigate("/blog");
      return;
    }

    setPost(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          <main className="flex-1 flex flex-col">
            <div className="container mx-auto px-6 py-8">
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-8" />
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!post) return null;

  return (
    <>
      <SEOHead
        title={post.seo_title || `${post.title} | Marketing.Tools Blog`}
        description={post.seo_description || post.excerpt || `Read ${post.title} on Marketing.Tools blog.`}
        ogImage={post.featured_image || undefined}
        ogType="article"
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

            <div className="border-b border-border bg-card">
              <div className="container mx-auto px-6 py-3">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link to="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground font-medium line-clamp-1">{post.title}</span>
                </nav>
              </div>
            </div>

            <article className="container mx-auto px-6 py-8 flex-1 max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {post.title}
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                {format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}
              </p>

              {post.featured_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div 
                className="prose prose-sm md:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default BlogPost;
