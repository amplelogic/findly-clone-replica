import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";

const categories = [
  "SEO Tools", "Social Media Marketing", "Email Marketing", "Content Marketing",
  "PPC Advertising", "Analytics Tracking", "Marketing Automation", "Copywriting Tools",
  "Video Marketing", "Influencer Marketing", "Affiliate Marketing", "Conversion Optimization",
  "Lead Generation", "Design Creatives", "Website Builders", "Ecommerce Marketing",
  "Mobile Marketing", "Chatbots Messaging", "Campaign Management"
];

const SubmitTool = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    category: "",
    website_url: "",
    pricing: "",
    tags: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to submit a tool.",
      });
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("submitted_tools").insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description,
        logo: formData.logo,
        category: formData.category || null,
        website_url: formData.website_url || null,
        pricing: formData.pricing || null,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : []
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Tool Submitted!",
        description: "Your tool has been submitted for review.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (submitted) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          <main className="flex-1 w-full flex flex-col">
            <Header user={user} />
            <div className="container mx-auto px-4 sm:px-6 py-12 flex-1 flex items-center justify-center">
              <Card className="max-w-md w-full text-center">
                <CardContent className="pt-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Submission Received!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for submitting your tool. Our team will review it and get back to you soon.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/dashboard">
                      <Button variant="outline">View Dashboard</Button>
                    </Link>
                    <Link to="/">
                      <Button>Browse Tools</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Footer />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CategorySidebar />
        
        <main className="flex-1 w-full flex flex-col">
          <Header user={user} />

          <div className="container mx-auto px-4 sm:px-6 py-6 flex-1">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Submit Your Tool
                  </CardTitle>
                  <CardDescription>
                    Get your tool featured on Marketing.Tools and reach thousands of marketers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tool Name *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., SEMrush"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Logo (emoji) *</Label>
                        <Input
                          value={formData.logo}
                          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                          placeholder="e.g., 🔍"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe what your tool does..."
                        required
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Pricing</Label>
                        <Select 
                          value={formData.pricing} 
                          onValueChange={(v) => setFormData({ ...formData, pricing: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select pricing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Freemium">Freemium</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Website URL</Label>
                      <Input
                        type="url"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        placeholder="https://yourtool.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g., seo, keyword research, analytics"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Tool"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
                <ul className="space-y-1">
                  <li>• Our team will review your submission within 24-48 hours</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• Approved tools get a lifetime listing on Marketing.Tools</li>
                </ul>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SubmitTool;
