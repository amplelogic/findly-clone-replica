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
  pricing?: string | null;
  tags?: string[] | null;
  bestFor?: string | null;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export const ToolCard = ({ name, description, logo, badge, category, websiteUrl, pricing, tags, bestFor }: ToolCardProps) => {
  return (
    <div className="relative p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer flex flex-col h-[140px] group overflow-hidden">
      {/* Badge */}
      {badge && (
        <div className="absolute top-2 right-3 z-10">
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

      {/* Default content */}
      <div className="flex flex-col flex-1 min-h-0">
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

      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-sm rounded-xl p-3 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        {/* Title stays visible */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0">
            <ToolLogo logo={logo} name={name} size="md" />
          </div>
          <h3 className="font-semibold text-sm text-foreground truncate">
            {name}
          </h3>
        </div>

        {/* Hover details */}
        <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
          {/* Best For / Main Purpose */}
          {bestFor && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full truncate">
                {bestFor}
              </span>
            </div>
          )}

          {/* Pricing */}
          {pricing && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-muted-foreground">Pricing:</span>
              <span className="text-[10px] font-semibold text-foreground">{pricing}</span>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-[9px] text-muted-foreground">+{tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
