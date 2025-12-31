import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, Pencil, Trash2, Home, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RichTextEditor } from "@/components/RichTextEditor";

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  badge: string | null;
  category: string | null;
  website_url: string | null;
  pricing: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published: boolean;
  published_at: string | null;
}

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"tool" | "category" | "blog">("tool");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [toolFormData, setToolFormData] = useState({ name: "", description: "", logo: "", badge: "", category: "", website_url: "", pricing: "" });
  const [categoryFormData, setCategoryFormData] = useState({ name: "", slug: "", icon: "" });
  const [blogFormData, setBlogFormData] = useState({ title: "", slug: "", content: "", excerpt: "", featured_image: "", published: false });
  const navigate = useNavigate();
  const { toast } = useToast();

  const defaultCategories = ["SEO Tools", "Social Media Marketing", "Email Marketing", "Content Marketing", "PPC Advertising", "Analytics Tracking", "Marketing Automation", "Copywriting Tools", "Video Marketing", "Influencer Marketing", "Affiliate Marketing", "Conversion Optimization", "Lead Generation", "Design Creatives", "Website Builders", "Ecommerce Marketing", "Mobile Marketing", "Chatbots Messaging", "Campaign Management"];

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => { if (isAdmin) { fetchTools(); fetchCategories(); fetchBlogPosts(); } }, [isAdmin]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    setUser(session.user);
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    if (!roles) { toast({ title: "Access Denied", description: "You don't have admin permissions.", variant: "destructive" }); navigate("/"); return; }
    setIsAdmin(true);
    setLoading(false);
  };

  const fetchTools = async () => { const { data } = await supabase.from("tools").select("*").order("created_at", { ascending: false }); if (data) setTools(data); };
  const fetchCategories = async () => { const { data } = await supabase.from("categories").select("*").order("name"); if (data) setCategories(data); };
  const fetchBlogPosts = async () => { const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }); if (data) setBlogPosts(data); };

  const handleToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedTool) {
        await supabase.from("tools").update({ name: toolFormData.name, description: toolFormData.description, logo: toolFormData.logo, badge: toolFormData.badge || null, category: toolFormData.category || null, website_url: toolFormData.website_url || null, pricing: toolFormData.pricing || null }).eq("id", selectedTool.id);
      } else {
        await supabase.from("tools").insert({ name: toolFormData.name, description: toolFormData.description, logo: toolFormData.logo, badge: toolFormData.badge || null, category: toolFormData.category || null, website_url: toolFormData.website_url || null, pricing: toolFormData.pricing || null });
      }
      toast({ title: "Success!", description: `Tool ${selectedTool ? "updated" : "added"} successfully.` });
      setIsToolDialogOpen(false);
      setSelectedTool(null);
      setToolFormData({ name: "", description: "", logo: "", badge: "", category: "", website_url: "", pricing: "" });
      fetchTools();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await supabase.from("categories").update({ name: categoryFormData.name, slug: categoryFormData.slug, icon: categoryFormData.icon || null }).eq("id", selectedCategory.id);
      } else {
        await supabase.from("categories").insert({ name: categoryFormData.name, slug: categoryFormData.slug, icon: categoryFormData.icon || null });
      }
      toast({ title: "Success!", description: `Category ${selectedCategory ? "updated" : "added"} successfully.` });
      setIsCategoryDialogOpen(false);
      setSelectedCategory(null);
      setCategoryFormData({ name: "", slug: "", icon: "" });
      fetchCategories();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = { title: blogFormData.title, slug: blogFormData.slug, content: blogFormData.content, excerpt: blogFormData.excerpt || null, featured_image: blogFormData.featured_image || null, published: blogFormData.published, published_at: blogFormData.published ? new Date().toISOString() : null, author_id: user.id };
      if (selectedBlogPost) {
        await supabase.from("blog_posts").update(postData).eq("id", selectedBlogPost.id);
      } else {
        await supabase.from("blog_posts").insert(postData);
      }
      toast({ title: "Success!", description: `Blog post ${selectedBlogPost ? "updated" : "created"} successfully.` });
      setIsBlogDialogOpen(false);
      setSelectedBlogPost(null);
      setBlogFormData({ title: "", slug: "", content: "", excerpt: "", featured_image: "", published: false });
      fetchBlogPosts();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === "tool" && selectedTool) {
        await supabase.from("tools").delete().eq("id", selectedTool.id);
        fetchTools();
      } else if (deleteType === "category" && selectedCategory) {
        await supabase.from("categories").delete().eq("id", selectedCategory.id);
        fetchCategories();
      } else if (deleteType === "blog" && selectedBlogPost) {
        await supabase.from("blog_posts").delete().eq("id", selectedBlogPost.id);
        fetchBlogPosts();
      }
      toast({ title: "Deleted!", description: "Item deleted successfully." });
      setIsDeleteDialogOpen(false);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage tools, categories & blog</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}><Home className="h-4 w-4 mr-2" />Home</Button>
            <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="tools" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="tools">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tools ({tools.length})</CardTitle>
                <Button onClick={() => { setSelectedTool(null); setToolFormData({ name: "", description: "", logo: "", badge: "", category: "", website_url: "", pricing: "" }); setIsToolDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Tool</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Logo</TableHead><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Category</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {tools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell><div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">{tool.logo}</div></TableCell>
                        <TableCell className="font-medium">{tool.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{tool.category || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedTool(tool); setToolFormData({ name: tool.name, description: tool.description, logo: tool.logo, badge: tool.badge || "", category: tool.category || "", website_url: tool.website_url || "", pricing: tool.pricing || "" }); setIsToolDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedTool(tool); setDeleteType("tool"); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Categories ({categories.length})</CardTitle>
                <Button onClick={() => { setSelectedCategory(null); setCategoryFormData({ name: "", slug: "", icon: "" }); setIsCategoryDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Category</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(cat); setCategoryFormData({ name: cat.name, slug: cat.slug, icon: cat.icon || "" }); setIsCategoryDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(cat); setDeleteType("category"); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog Posts ({blogPosts.length})</CardTitle>
                <Button onClick={() => { setSelectedBlogPost(null); setBlogFormData({ title: "", slug: "", content: "", excerpt: "", featured_image: "", published: false }); setIsBlogDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Post</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell><span className={`px-2 py-1 text-xs rounded ${post.published ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>{post.published ? 'Published' : 'Draft'}</span></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedBlogPost(post); setBlogFormData({ title: post.title, slug: post.slug, content: post.content, excerpt: post.excerpt || "", featured_image: post.featured_image || "", published: post.published }); setIsBlogDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedBlogPost(post); setDeleteType("blog"); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{selectedTool ? "Edit Tool" : "Add Tool"}</DialogTitle></DialogHeader>
            <form onSubmit={handleToolSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={toolFormData.name} onChange={(e) => setToolFormData({ ...toolFormData, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Logo (emoji) *</Label><Input value={toolFormData.logo} onChange={(e) => setToolFormData({ ...toolFormData, logo: e.target.value })} required /></div>
              </div>
              <div className="space-y-2"><Label>Description *</Label><Textarea value={toolFormData.description} onChange={(e) => setToolFormData({ ...toolFormData, description: e.target.value })} required rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label><Select value={toolFormData.category} onValueChange={(v) => setToolFormData({ ...toolFormData, category: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{defaultCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Badge</Label><Select value={toolFormData.badge} onValueChange={(v) => setToolFormData({ ...toolFormData, badge: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Popular">Popular</SelectItem><SelectItem value="Deal">Deal</SelectItem><SelectItem value="Free">Free</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Website URL</Label><Input type="url" value={toolFormData.website_url} onChange={(e) => setToolFormData({ ...toolFormData, website_url: e.target.value })} /></div>
                <div className="space-y-2"><Label>Pricing</Label><Select value={toolFormData.pricing} onValueChange={(v) => setToolFormData({ ...toolFormData, pricing: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Free">Free</SelectItem><SelectItem value="Freemium">Freemium</SelectItem><SelectItem value="Paid">Paid</SelectItem></SelectContent></Select></div>
              </div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsToolDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{selectedCategory ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={categoryFormData.name} onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Slug *</Label><Input value={categoryFormData.slug} onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Icon (emoji)</Label><Input value={categoryFormData.icon} onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })} /></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{selectedBlogPost ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Title *</Label><Input value={blogFormData.title} onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Slug *</Label><Input value={blogFormData.slug} onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })} required /></div>
              </div>
              <div className="space-y-2"><Label>Excerpt</Label><Textarea value={blogFormData.excerpt} onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>Featured Image URL</Label><Input value={blogFormData.featured_image} onChange={(e) => setBlogFormData({ ...blogFormData, featured_image: e.target.value })} /></div>
              <div className="space-y-2"><Label>Content *</Label><RichTextEditor content={blogFormData.content} onChange={(c) => setBlogFormData({ ...blogFormData, content: c })} /></div>
              <div className="flex items-center gap-2"><Switch checked={blogFormData.published} onCheckedChange={(c) => setBlogFormData({ ...blogFormData, published: c })} /><Label>Publish</Label></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsBlogDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;
