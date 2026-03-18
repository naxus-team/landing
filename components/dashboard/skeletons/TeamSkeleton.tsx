import { Skeleton } from "@/components/ui/skeleton";

export default function TeamSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-12 rounded-full" />
        <Skeleton className="h-8 w-40 rounded-xl" />
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>

      <Skeleton className="h-9 w-64 rounded-xl" />

      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-20 rounded-full" />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border bg-card">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-36 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48 rounded-lg" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="hidden sm:block h-7 w-28 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl border bg-card">
            <Skeleton className="h-7 w-8 rounded-lg" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}