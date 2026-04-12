import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-7">
      {/* Header */}
      <div>
        <Skeleton className="h-3.5 w-32 mb-1" />
        <Skeleton className="h-8 w-64" />
      </div>

      {/* CTA button */}
      <Skeleton className="h-9 w-full rounded-lg" />

      {/* Nearby stops carousel */}
      <div>
        <Skeleton className="h-3.5 w-32 mb-3" />
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shrink-0 w-52 rounded-xl border bg-card p-3.5 space-y-2.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
