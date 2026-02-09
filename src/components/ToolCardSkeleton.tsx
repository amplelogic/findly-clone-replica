import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ToolCardSkeleton = () => {
  return (
    <Card className="border-border">
      <CardContent className="p-2.5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-7 h-7 rounded-md flex-shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="w-4 h-4 rounded" />
        </div>
        <Skeleton className="h-3 w-3/4 mt-1" />
      </CardContent>
    </Card>
  );
};
