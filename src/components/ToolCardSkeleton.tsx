import { Skeleton } from "@/components/ui/skeleton";

export const ToolCardSkeleton = () => {
  return (
    <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};
