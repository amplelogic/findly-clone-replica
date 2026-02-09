import { Badge } from "@/components/ui/badge";
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

export const ToolCard = ({ name, description, logo, badge }: ToolCardProps) => {
  return (
    <div className="relative flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
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

      {/* Logo */}
      <div className="flex-shrink-0">
        <ToolLogo logo={logo} name={name} size="md" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <h3 className="font-semibold text-sm text-foreground truncate mb-0.5">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
