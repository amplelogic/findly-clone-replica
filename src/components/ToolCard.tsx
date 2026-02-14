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
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

const getPricingColor = (pricing?: string | null) => {
  if (!pricing) return { dot: "bg-gray-400", border: "hover:border-gray-400", bg: "hover:shadow-gray-400/20" };
  const p = pricing.toLowerCase();
  if (p.includes("freemium")) return { dot: "bg-yellow-500", border: "hover:border-yellow-500", bg: "hover:shadow-yellow-500/20" };
  if (p.includes("trial")) return { dot: "bg-blue-500", border: "hover:border-blue-500", bg: "hover:shadow-blue-500/20" };
  if (p.includes("free")) return { dot: "bg-green-500", border: "hover:border-green-500", bg: "hover:shadow-green-500/20" };
  if (p.includes("paid") || pricing) return { dot: "bg-red-500", border: "hover:border-red-500", bg: "hover:shadow-red-500/20" };
  return { dot: "bg-gray-400", border: "hover:border-gray-400", bg: "hover:shadow-gray-400/20" };
};

export const ToolCard = ({ name, description, logo, badge, category, websiteUrl, pricing }: ToolCardProps) => {
  const colors = getPricingColor(pricing);

  return (
    <div className={`relative p-3 bg-card border border-border rounded-xl transition-all duration-300 cursor-pointer flex flex-col hover:shadow-md ${colors.border} ${colors.bg}`}>
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
        <h3 className="font-semibold text-[15px] text-foreground truncate flex items-center gap-1.5">
          {name}
          <span className={`inline-block w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`} />
        </h3>
      </div>

      {/* Description */}
      <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed flex-1">
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

export { getPricingColor };
