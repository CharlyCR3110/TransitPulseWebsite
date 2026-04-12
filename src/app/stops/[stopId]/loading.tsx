import { Skeleton } from '@/components/ui/skeleton';

export default function StopDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-5">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-48 mb-1" />
        <Skeleton className="h-3.5 w-28" />
      </div>

      {/* Served routes */}
      <div>
        <Skeleton className="h-3.5 w-36 mb-2" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Arrivals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t" />}
              <div className="flex items-start gap-3 px-4 py-3.5">
                <Skeleton className="h-6 w-12 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
