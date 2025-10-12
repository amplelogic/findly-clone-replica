import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ToolCardProps {
  name: string;
  description: string;
  logo: string;
  badge?: "New" | "Deal";
}

export const ToolCard = ({ name, description, logo, badge }: ToolCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/20">
      <CardContent className="p-3">
        <div className="flex items-start gap-2.5">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
              <span className="text-lg font-bold text-foreground">{logo}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              {badge && (
                <Badge 
                  variant={badge === "New" ? "default" : "secondary"}
                  className={badge === "New" ? "bg-primary text-primary-foreground text-xs px-1.5 py-0" : "bg-accent text-accent-foreground text-xs px-1.5 py-0"}
                >
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
