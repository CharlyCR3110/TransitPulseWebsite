import { Skeleton } from '@/components/ui/skeleton';

export default function RouteDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-8 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Status */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Arrivals */}
      <div>
        <Skeleton className="h-5 w-36 mb-3" />
        <div className="rounded-xl border bg-card overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t" />}
              <div className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stops */}
      <div>
        <Skeleton className="h-5 w-44 mb-3" />
        <div className="rounded-xl border bg-card overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t" />}
              <div className="flex items-center justify-between px-4 py-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
