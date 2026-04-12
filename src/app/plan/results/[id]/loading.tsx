import { Skeleton } from '@/components/ui/skeleton';

export default function TripDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">
      {/* Map placeholder */}
      <Skeleton className="h-44 w-full rounded-xl" />

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-3 text-center space-y-1.5">
            <Skeleton className="h-3 w-12 mx-auto" />
            <Skeleton className="h-6 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Reliability / freshness */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Occupancy */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Itinerary */}
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="rounded-xl border bg-card overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t" />}
              <div className="px-4 py-4 space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32 ml-auto" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
