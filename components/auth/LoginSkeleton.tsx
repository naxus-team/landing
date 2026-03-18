import { Skeleton } from "@/components/ui/skeleton";

export default function LoginSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-full" />
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <Skeleton className="flex-1 h-px rounded-full" />
        <Skeleton className="h-3 w-6 rounded-full" />
        <Skeleton className="flex-1 h-px rounded-full" />
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-12 rounded-full" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-3 w-28 rounded-full" />
          </div>
          <Skeleton className="h-10 rounded-xl" />
        </div>
        <Skeleton className="h-10 rounded-xl mt-1" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1.5">
        <Skeleton className="h-3 w-36 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
      </div>
    </div>
  );
}