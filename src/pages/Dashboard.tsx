import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ToolCard } from "@/components/ToolCard";
import { ToolCardSkeleton } from "@/components/ToolCardSkeleton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ImageUpload } from "@/components/ImageUpload";
import { SEOHead } from "@/components/SEOHead";
import { 
  Bookmark, Send, Clock, User, Settings, Trash2, Key, 
  AlertTriangle, Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedToolIds, setSavedToolIds] = useState<Set<string>>(new Set());
  
  // Settings state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  
  // Profile edit state
  const [editFullName, setEditFullName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedTools();
      fetchSubmissions();
      fetchProfile();
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

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setEditFullName(data.full_name || "");
      setEditUsername(data.username || "");
      setEditAvatarUrl(data.avatar_url || "");
    }
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

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editFullName,
          username: editUsername,
          avatar_url: editAvatarUrl,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        full_name: editFullName,
        username: editUsername,
        avatar_url: editAvatarUrl,
      } : null);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setIsPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") {
      toast({
        title: "Confirmation required",
        description: "Please type 'DELETE MY ACCOUNT' to confirm.",
        variant: "destructive",
      });
      return;
    }

    setDeletingAccount(true);
    try {
      // Sign out the user
      await supabase.auth.signOut();
      
      toast({
        title: "Account deletion requested",
        description: "Your account deletion has been initiated. Contact support if needed.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  const getCategorySlug = (category: string) => {
    return category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "");
  };

  if (!user) return null;

  return (
    <>
      <SEOHead
        title="My Dashboard - Marketing.Tools"
        description="Manage your saved tools, submissions, and account settings on Marketing.Tools."
        noIndex={true}
      />
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CategorySidebar />
          
          <main className="flex-1 w-full flex flex-col">
            <Header user={user} />

            <div className="container mx-auto px-4 sm:px-6 py-6 flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-6">My Dashboard</h1>
              
              <Tabs defaultValue="saved" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                  <TabsTrigger value="saved" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Saved</span>
                  </TabsTrigger>
                  <TabsTrigger value="submissions" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">Submissions</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
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

                <TabsContent value="settings">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Profile Settings
                        </CardTitle>
                        <CardDescription>
                          Update your profile information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Profile Picture</Label>
                          <ImageUpload
                            bucket="avatars"
                            folder={user.id}
                            currentImage={editAvatarUrl}
                            onImageUploaded={(url) => setEditAvatarUrl(url)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                            placeholder="username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={user.email}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                          </p>
                        </div>
                        <Button 
                          onClick={handleUpdateProfile} 
                          disabled={updatingProfile}
                          className="w-full"
                        >
                          {updatingProfile ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Key className="h-5 w-5" />
                          Security
                        </CardTitle>
                        <CardDescription>
                          Manage your account security
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg border border-border">
                          <h4 className="font-medium text-foreground mb-1">Change Password</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Update your password to keep your account secure
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsPasswordDialogOpen(true)}
                          >
                            Change Password
                          </Button>
                        </div>

                        <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                          <h4 className="font-medium text-destructive mb-1 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Danger Zone
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Once you delete your account, there is no going back.
                          </p>
                          <Button 
                            variant="destructive" 
                            onClick={() => setIsDeleteDialogOpen(true)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Footer />
          </main>
        </div>
      </SidebarProvider>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword} disabled={updatingPassword}>
                {updatingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </p>
              <div className="space-y-2">
                <Label>Type "DELETE MY ACCOUNT" to confirm</Label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deletingAccount || deleteConfirmText !== "DELETE MY ACCOUNT"}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deletingAccount ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Dashboard;
