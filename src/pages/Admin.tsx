import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, Pencil, Trash2, Home, Users, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUpload } from "@/components/ImageUpload";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  badge: string | null;
  category: string | null;
  website_url: string | null;
  pricing: string | null;
  slug: string | null;
  tags: string[] | null;
  overview: string | null;
  features: string[] | null;
  use_cases: string | null;
  best_for: string | null;
  faqs: any;
  youtube_tutorials: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
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
  seo_title: string | null;
  seo_description: string | null;
}

interface SubmittedTool {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string | null;
  website_url: string | null;
  pricing: string | null;
  tags: string[] | null;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [submissions, setSubmissions] = useState<SubmittedTool[]>([]);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"tool" | "category" | "blog" | "submission">("tool");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmittedTool | null>(null);
  
  const [toolFormData, setToolFormData] = useState({
    name: "", description: "", logo: "", badge: "", category: "", website_url: "", pricing: "",
    slug: "", tags: "", overview: "", features: "", use_cases: "", best_for: "",
    faqs: [{ question: "", answer: "" }], youtube_tutorials: "",
    seo_title: "", seo_description: ""
  });
  
  const [categoryFormData, setCategoryFormData] = useState({ name: "", slug: "", icon: "" });
  const [blogFormData, setBlogFormData] = useState({ 
    title: "", slug: "", content: "", excerpt: "", featured_image: "", published: false,
    seo_title: "", seo_description: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const defaultCategories = ["SEO Tools", "Social Media Marketing", "Email Marketing", "Content Marketing", "PPC Advertising", "Analytics Tracking", "Marketing Automation", "Copywriting Tools", "Video Marketing", "Influencer Marketing", "Affiliate Marketing", "Conversion Optimization", "Lead Generation", "Design Creatives", "Website Builders", "Ecommerce Marketing", "Mobile Marketing", "Chatbots Messaging", "Campaign Management"];

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => { if (isAdmin) { fetchAll(); } }, [isAdmin]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    setUser(session.user);
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
    if (!roles) { toast({ title: "Access Denied", description: "You don't have admin permissions.", variant: "destructive" }); navigate("/"); return; }
    setIsAdmin(true);
    setLoading(false);
  };

  const fetchAll = async () => {
    const [toolsRes, catsRes, postsRes, subsRes] = await Promise.all([
      supabase.from("tools").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("submitted_tools").select("*").order("created_at", { ascending: false })
    ]);
    if (toolsRes.data) setTools(toolsRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    if (postsRes.data) setBlogPosts(postsRes.data);
    if (subsRes.data) setSubmissions(subsRes.data);
  };

  const handleToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const toolData = {
        name: toolFormData.name,
        description: toolFormData.description,
        logo: toolFormData.logo,
        badge: toolFormData.badge || null,
        category: toolFormData.category || null,
        website_url: toolFormData.website_url || null,
        pricing: toolFormData.pricing || null,
        slug: toolFormData.slug || toolFormData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        tags: toolFormData.tags ? toolFormData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        overview: toolFormData.overview || null,
        features: toolFormData.features ? toolFormData.features.split("\n").map(f => f.trim()).filter(Boolean) : [],
        use_cases: toolFormData.use_cases || null,
        best_for: toolFormData.best_for || null,
        faqs: toolFormData.faqs.filter(f => f.question && f.answer),
        youtube_tutorials: toolFormData.youtube_tutorials ? toolFormData.youtube_tutorials.split("\n").map(u => u.trim()).filter(Boolean) : [],
        seo_title: toolFormData.seo_title || null,
        seo_description: toolFormData.seo_description || null
      };

      if (selectedTool) {
        await supabase.from("tools").update(toolData).eq("id", selectedTool.id);
      } else {
        await supabase.from("tools").insert(toolData);
      }
      toast({ title: "Success!", description: `Tool ${selectedTool ? "updated" : "added"} successfully.` });
      setIsToolDialogOpen(false);
      resetToolForm();
      fetchAll();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const resetToolForm = () => {
    setSelectedTool(null);
    setToolFormData({
      name: "", description: "", logo: "", badge: "", category: "", website_url: "", pricing: "",
      slug: "", tags: "", overview: "", features: "", use_cases: "", best_for: "",
      faqs: [{ question: "", answer: "" }], youtube_tutorials: "",
      seo_title: "", seo_description: ""
    });
  };

  const editTool = (tool: Tool) => {
    setSelectedTool(tool);
    setToolFormData({
      name: tool.name,
      description: tool.description,
      logo: tool.logo,
      badge: tool.badge || "",
      category: tool.category || "",
      website_url: tool.website_url || "",
      pricing: tool.pricing || "",
      slug: tool.slug || "",
      tags: tool.tags?.join(", ") || "",
      overview: tool.overview || "",
      features: tool.features?.join("\n") || "",
      use_cases: tool.use_cases || "",
      best_for: tool.best_for || "",
      faqs: Array.isArray(tool.faqs) && tool.faqs.length > 0 ? tool.faqs : [{ question: "", answer: "" }],
      youtube_tutorials: tool.youtube_tutorials?.join("\n") || "",
      seo_title: tool.seo_title || "",
      seo_description: tool.seo_description || ""
    });
    setIsToolDialogOpen(true);
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
      fetchAll();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = { 
        title: blogFormData.title, 
        slug: blogFormData.slug, 
        content: blogFormData.content, 
        excerpt: blogFormData.excerpt || null, 
        featured_image: blogFormData.featured_image || null, 
        published: blogFormData.published, 
        published_at: blogFormData.published ? new Date().toISOString() : null, 
        author_id: user.id,
        seo_title: blogFormData.seo_title || null,
        seo_description: blogFormData.seo_description || null
      };
      if (selectedBlogPost) {
        await supabase.from("blog_posts").update(postData).eq("id", selectedBlogPost.id);
      } else {
        await supabase.from("blog_posts").insert(postData);
      }
      toast({ title: "Success!", description: `Blog post ${selectedBlogPost ? "updated" : "created"} successfully.` });
      setIsBlogDialogOpen(false);
      setSelectedBlogPost(null);
      setBlogFormData({ title: "", slug: "", content: "", excerpt: "", featured_image: "", published: false, seo_title: "", seo_description: "" });
      fetchAll();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleApproveSubmission = async (submission: SubmittedTool) => {
    try {
      // Create tool from submission
      await supabase.from("tools").insert({
        name: submission.name,
        description: submission.description,
        logo: submission.logo,
        category: submission.category,
        website_url: submission.website_url,
        pricing: submission.pricing,
        tags: submission.tags,
        slug: submission.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      });
      
      // Update submission status
      await supabase.from("submitted_tools").update({ status: "approved" }).eq("id", submission.id);
      
      toast({ title: "Approved!", description: "Tool has been added to the directory." });
      fetchAll();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleRejectSubmission = async (submission: SubmittedTool) => {
    try {
      await supabase.from("submitted_tools").update({ status: "rejected" }).eq("id", submission.id);
      toast({ title: "Rejected", description: "Submission has been rejected." });
      fetchAll();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === "tool" && selectedTool) {
        await supabase.from("tools").delete().eq("id", selectedTool.id);
      } else if (deleteType === "category" && selectedCategory) {
        await supabase.from("categories").delete().eq("id", selectedCategory.id);
      } else if (deleteType === "blog" && selectedBlogPost) {
        await supabase.from("blog_posts").delete().eq("id", selectedBlogPost.id);
      } else if (deleteType === "submission" && selectedSubmission) {
        await supabase.from("submitted_tools").delete().eq("id", selectedSubmission.id);
      }
      toast({ title: "Deleted!", description: "Item deleted successfully." });
      setIsDeleteDialogOpen(false);
      fetchAll();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const addFaq = () => {
    setToolFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setToolFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
    }));
  };

  const removeFaq = (index: number) => {
    setToolFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <>
      <SEOHead 
        title="Admin Panel - Marketing.Tools" 
        description="Manage tools, categories, blog posts and user submissions."
        noIndex={true}
      />
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage tools, categories, blog & submissions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")}><Home className="h-4 w-4 mr-2" />Home</Button>
              <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
            </div>
          </div>

          <Tabs defaultValue="tools" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="submissions">
                Submissions
                {submissions.filter(s => s.status === "pending").length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {submissions.filter(s => s.status === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tools">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tools ({tools.length})</CardTitle>
                  <Button onClick={() => { resetToolForm(); setIsToolDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Tool</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Logo</TableHead><TableHead>Name</TableHead><TableHead className="hidden md:table-cell">Category</TableHead><TableHead className="hidden lg:table-cell">Tags</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {tools.map((tool) => (
                        <TableRow key={tool.id}>
                          <TableCell>
                            {tool.logo.startsWith("http") ? (
                              <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">{tool.logo}</div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{tool.category || "-"}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex gap-1 flex-wrap">
                              {tool.tags?.slice(0, 2).map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                              {tool.tags && tool.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{tool.tags.length - 2}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => editTool(tool)}><Pencil className="h-4 w-4" /></Button>
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
                  <Button onClick={() => { setSelectedBlogPost(null); setBlogFormData({ title: "", slug: "", content: "", excerpt: "", featured_image: "", published: false, seo_title: "", seo_description: "" }); setIsBlogDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Post</Button>
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
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedBlogPost(post); setBlogFormData({ title: post.title, slug: post.slug, content: post.content, excerpt: post.excerpt || "", featured_image: post.featured_image || "", published: post.published, seo_title: post.seo_title || "", seo_description: post.seo_description || "" }); setIsBlogDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedBlogPost(post); setDeleteType("blog"); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Submissions ({submissions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No submissions yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tool</TableHead>
                          <TableHead className="hidden md:table-cell">Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{sub.logo}</span>
                                <span className="font-medium">{sub.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">{sub.category || "-"}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded ${
                                sub.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                                sub.status === 'rejected' ? 'bg-red-500/10 text-red-600' :
                                'bg-yellow-500/10 text-yellow-600'
                              }`}>
                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {sub.status === "pending" && (
                                <>
                                  <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleApproveSubmission(sub)}>Approve</Button>
                                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRejectSubmission(sub)}>Reject</Button>
                                </>
                              )}
                              <Button variant="ghost" size="icon" onClick={() => { setSelectedSubmission(sub); setDeleteType("submission"); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Tool Dialog */}
          <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh]">
              <DialogHeader><DialogTitle>{selectedTool ? "Edit Tool" : "Add Tool"}</DialogTitle></DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-100px)] pr-4">
                <form onSubmit={handleToolSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Name *</Label><Input value={toolFormData.name} onChange={(e) => setToolFormData({ ...toolFormData, name: e.target.value })} required /></div>
                      <div className="space-y-2"><Label>Slug</Label><Input value={toolFormData.slug} onChange={(e) => setToolFormData({ ...toolFormData, slug: e.target.value })} placeholder="auto-generated" /></div>
                    </div>
                    <div className="space-y-2"><Label>Description *</Label><Textarea value={toolFormData.description} onChange={(e) => setToolFormData({ ...toolFormData, description: e.target.value })} required rows={2} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Logo</Label>
                        <ImageUpload
                          bucket="tool-logos"
                          currentImage={toolFormData.logo.startsWith("http") ? toolFormData.logo : undefined}
                          onImageUploaded={(url) => setToolFormData({ ...toolFormData, logo: url })}
                        />
                        <Input 
                          value={toolFormData.logo} 
                          onChange={(e) => setToolFormData({ ...toolFormData, logo: e.target.value })} 
                          placeholder="Or enter emoji/URL"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2"><Label>Category</Label><Select value={toolFormData.category} onValueChange={(v) => setToolFormData({ ...toolFormData, category: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{defaultCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Badge</Label><Select value={toolFormData.badge} onValueChange={(v) => setToolFormData({ ...toolFormData, badge: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Popular">Popular</SelectItem><SelectItem value="Deal">Deal</SelectItem><SelectItem value="Free">Free</SelectItem></SelectContent></Select></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Website URL</Label><Input type="url" value={toolFormData.website_url} onChange={(e) => setToolFormData({ ...toolFormData, website_url: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Pricing</Label><Select value={toolFormData.pricing} onValueChange={(v) => setToolFormData({ ...toolFormData, pricing: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Free">Free</SelectItem><SelectItem value="Freemium">Freemium</SelectItem><SelectItem value="Paid">Paid</SelectItem></SelectContent></Select></div>
                    </div>
                    <div className="space-y-2"><Label>Tags (comma separated)</Label><Input value={toolFormData.tags} onChange={(e) => setToolFormData({ ...toolFormData, tags: e.target.value })} placeholder="seo, keyword research, analytics" /></div>
                  </div>

                  {/* Detailed Content */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Detailed Content</h3>
                    <div className="space-y-2"><Label>Overview</Label><Textarea value={toolFormData.overview} onChange={(e) => setToolFormData({ ...toolFormData, overview: e.target.value })} rows={3} placeholder="Detailed overview of the tool..." /></div>
                    <div className="space-y-2"><Label>Features (one per line)</Label><Textarea value={toolFormData.features} onChange={(e) => setToolFormData({ ...toolFormData, features: e.target.value })} rows={4} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" /></div>
                    <div className="space-y-2"><Label>Real-world Use Cases</Label><Textarea value={toolFormData.use_cases} onChange={(e) => setToolFormData({ ...toolFormData, use_cases: e.target.value })} rows={3} /></div>
                    <div className="space-y-2"><Label>Who It's Best For</Label><Textarea value={toolFormData.best_for} onChange={(e) => setToolFormData({ ...toolFormData, best_for: e.target.value })} rows={2} /></div>
                  </div>

                  {/* FAQs */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">FAQs</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addFaq}><Plus className="h-3 w-3 mr-1" />Add FAQ</Button>
                    </div>
                    {toolFormData.faqs.map((faq, index) => (
                      <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label>FAQ {index + 1}</Label>
                          {toolFormData.faqs.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)}><Trash2 className="h-3 w-3" /></Button>
                          )}
                        </div>
                        <Input value={faq.question} onChange={(e) => updateFaq(index, "question", e.target.value)} placeholder="Question" />
                        <Textarea value={faq.answer} onChange={(e) => updateFaq(index, "answer", e.target.value)} placeholder="Answer" rows={2} />
                      </div>
                    ))}
                  </div>

                  {/* YouTube Tutorials */}
                  <div className="space-y-2">
                    <Label>YouTube Tutorial URLs (one per line)</Label>
                    <Textarea value={toolFormData.youtube_tutorials} onChange={(e) => setToolFormData({ ...toolFormData, youtube_tutorials: e.target.value })} rows={3} placeholder="https://youtube.com/watch?v=...&#10;https://youtu.be/..." />
                  </div>

                  {/* SEO */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">SEO Settings</h3>
                    <div className="space-y-2">
                      <Label>SEO Title</Label>
                      <Input value={toolFormData.seo_title} onChange={(e) => setToolFormData({ ...toolFormData, seo_title: e.target.value })} placeholder="Custom SEO title (defaults to tool name)" maxLength={60} />
                      <p className="text-xs text-muted-foreground">{toolFormData.seo_title.length}/60 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label>SEO Meta Description</Label>
                      <Textarea value={toolFormData.seo_description} onChange={(e) => setToolFormData({ ...toolFormData, seo_description: e.target.value })} placeholder="Custom meta description for search engines" rows={2} maxLength={160} />
                      <p className="text-xs text-muted-foreground">{toolFormData.seo_description.length}/160 characters</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsToolDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Tool</Button>
                  </div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Category Dialog */}
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>{selectedCategory ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={categoryFormData.name} onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Slug *</Label><Input value={categoryFormData.slug} onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Icon (emoji)</Label><Input value={categoryFormData.icon} onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })} /></div>
                <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Blog Dialog */}
          <Dialog open={isBlogDialogOpen} onOpenChange={setIsBlogDialogOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh]">
              <DialogHeader><DialogTitle>{selectedBlogPost ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-100px)] pr-4">
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Title *</Label><Input value={blogFormData.title} onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>Slug *</Label><Input value={blogFormData.slug} onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })} required /></div>
                  </div>
                  <div className="space-y-2"><Label>Excerpt</Label><Textarea value={blogFormData.excerpt} onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })} rows={2} /></div>
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <ImageUpload
                      bucket="blog-images"
                      currentImage={blogFormData.featured_image || undefined}
                      onImageUploaded={(url) => setBlogFormData({ ...blogFormData, featured_image: url })}
                    />
                  </div>
                  <div className="space-y-2"><Label>Content *</Label><RichTextEditor content={blogFormData.content} onChange={(content) => setBlogFormData({ ...blogFormData, content })} /></div>
                  
                  {/* SEO Fields */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium text-foreground">SEO Settings</h3>
                    <div className="space-y-2">
                      <Label>SEO Title</Label>
                      <Input value={blogFormData.seo_title} onChange={(e) => setBlogFormData({ ...blogFormData, seo_title: e.target.value })} placeholder="Custom SEO title" maxLength={60} />
                      <p className="text-xs text-muted-foreground">{blogFormData.seo_title.length}/60 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label>SEO Meta Description</Label>
                      <Textarea value={blogFormData.seo_description} onChange={(e) => setBlogFormData({ ...blogFormData, seo_description: e.target.value })} placeholder="Custom meta description" rows={2} maxLength={160} />
                      <p className="text-xs text-muted-foreground">{blogFormData.seo_description.length}/160 characters</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4"><Switch id="published" checked={blogFormData.published} onCheckedChange={(checked) => setBlogFormData({ ...blogFormData, published: checked })} /><Label htmlFor="published">Published</Label></div>
                  <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsBlogDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></div>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will permanently delete this item.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default Admin;
