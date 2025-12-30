import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ToolCardProps {
  name: string;
  description: string;
  logo: string;
  badge?: "New" | "Deal" | "Popular" | "Free";
}

export const ToolCard = ({ name, description, logo, badge }: ToolCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/20">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-lg font-bold text-foreground">{logo}</span>
            </div>
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors flex-1 line-clamp-1">
              {name}
            </h3>
            {badge && (
              <Badge 
                variant={badge === "New" ? "default" : "secondary"}
                className={
                  badge === "New" 
                    ? "bg-primary text-primary-foreground text-xs px-1.5 py-0" 
                    : badge === "Popular"
                    ? "bg-amber-500/10 text-amber-600 text-xs px-1.5 py-0"
                    : badge === "Free"
                    ? "bg-green-500/10 text-green-600 text-xs px-1.5 py-0"
                    : "bg-accent text-accent-foreground text-xs px-1.5 py-0"
                }
              >
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};