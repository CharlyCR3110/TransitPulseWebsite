import { Skeleton } from '@/components/ui/skeleton';

export default function AlertsLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5">
      <div className="mb-5">
        <Skeleton className="h-7 w-40 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
