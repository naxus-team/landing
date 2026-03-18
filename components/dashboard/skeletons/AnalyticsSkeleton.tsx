import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl border bg-card">
            <Skeleton className="h-7 w-12 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl border bg-card">
            <Skeleton className="h-7 w-20 rounded-lg" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 p-5 rounded-2xl border bg-card">
            <Skeleton className="h-3 w-40 rounded-full" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-5 rounded-2xl border bg-card">
        <Skeleton className="h-3 w-36 rounded-full" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    </div>
  );
}