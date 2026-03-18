import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsListSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm rounded-xl" />
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border bg-card">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-36 rounded-lg" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48 rounded-lg" />
            </div>
            <Skeleton className="hidden sm:block h-3 w-16 rounded-lg" />
            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}