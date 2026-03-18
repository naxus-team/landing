import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-8 w-56 rounded-xl" />
        <Skeleton className="h-4 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl border bg-card">
            <Skeleton className="h-7 w-8 rounded-lg" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-6 rounded-2xl border bg-card">
        <Skeleton className="h-3 w-32 rounded-full" />
        <div className="flex flex-col items-center gap-3 py-8">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-lg" />
          <Skeleton className="h-3 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}