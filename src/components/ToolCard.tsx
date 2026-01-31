import { Badge } from "@/components/ui/badge";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ToolLogo } from "@/components/ToolLogo";

interface ToolCardProps {
  id?: string;
  name: string;
  description: string;
  logo: string;
  badge?: "New" | "Deal" | "Popular" | "Free";
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export const ToolCard = ({ id, name, description, logo, badge, isSaved = false, onSaveToggle }: ToolCardProps) => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please sign in to save tools.",
      });
      navigate("/auth");
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await supabase
          .from("saved_tools")
          .delete()
          .eq("user_id", session.user.id)
          .eq("tool_id", id);
      } else {
        await supabase
          .from("saved_tools")
          .insert({ user_id: session.user.id, tool_id: id });
      }
      onSaveToggle?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tool.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
      {/* Logo */}
      <div className="flex-shrink-0">
        <ToolLogo logo={logo} name={name} size="md" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          {badge && (
            <Badge 
              variant={badge === "New" ? "default" : "secondary"}
              className={
                badge === "New" 
                  ? "bg-primary text-primary-foreground text-[10px] px-1.5 py-0" 
                  : badge === "Popular"
                  ? "bg-amber-500/10 text-amber-600 text-[10px] px-1.5 py-0"
                  : badge === "Free"
                  ? "bg-green-500/10 text-green-600 text-[10px] px-1.5 py-0"
                  : "bg-accent text-accent-foreground text-[10px] px-1.5 py-0"
              }
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleBookmarkClick}
        disabled={saving}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
      >
        <Bookmark 
          className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
        />
      </button>
    </div>
  );
};
