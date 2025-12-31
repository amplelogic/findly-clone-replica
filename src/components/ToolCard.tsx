import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/20">
      <CardContent className="p-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-sm font-bold text-foreground">{logo}</span>
          </div>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex-1 line-clamp-1">
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
          <button
            onClick={handleBookmarkClick}
            disabled={saving}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <Bookmark 
              className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
            />
          </button>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
