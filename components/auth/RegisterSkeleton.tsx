import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <Skeleton className="h-4 w-56 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="flex-1 h-px rounded-full" />
        <Skeleton className="h-3 w-6 rounded-full" />
        <Skeleton className="flex-1 h-px rounded-full" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-3 w-64 rounded-full mx-auto" />
        <Skeleton className="h-10 rounded-xl mt-1" />
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <Skeleton className="h-3 w-40 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
      </div>
    </div>
  );
}