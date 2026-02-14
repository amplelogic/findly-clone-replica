import { Badge } from "@/components/ui/badge";
import { ToolLogo } from "@/components/ToolLogo";
import { ExternalLink } from "lucide-react";

interface ToolCardProps {
  id?: string;
  name: string;
  description: string;
  logo: string;
  badge?: "New" | "Deal" | "Popular" | "Free";
  category?: string | null;
  websiteUrl?: string | null;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export const ToolCard = ({ name, description, logo, badge, category, websiteUrl }: ToolCardProps) => {
  return (
    <div className="relative p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer flex flex-col">
      {/* Badge */}
      {badge && (
        <div className="absolute top-2 right-3">
          <Badge
            variant="secondary"
            className={
              badge === "Deal"
                ? "bg-green-500/10 text-green-600 text-[10px] px-1.5 py-0 font-medium"
                : badge === "New"
                ? "bg-primary/10 text-primary text-[10px] px-1.5 py-0 font-medium"
                : badge === "Popular"
                ? "bg-amber-500/10 text-amber-600 text-[10px] px-1.5 py-0 font-medium"
                : "bg-green-500/10 text-green-600 text-[10px] px-1.5 py-0 font-medium"
            }
          >
            {badge}
          </Badge>
        </div>
      )}

      {/* Logo + Title row */}
      <div className="flex items-center gap-3 mb-1.5">
        <div className="flex-shrink-0">
          <ToolLogo logo={logo} name={name} size="md" />
        </div>
        <h3 className="font-semibold text-sm text-foreground truncate">
          {name}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        {category ? (
          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full truncate max-w-[60%]">
            {category}
          </span>
        ) : (
          <span />
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
