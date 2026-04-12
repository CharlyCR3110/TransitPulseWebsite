import { Skeleton } from '@/components/ui/skeleton';

export default function RoutesLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 space-y-6">
      <div>
        <Skeleton className="h-7 w-24 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>

      {[0, 1].map((section) => (
        <section key={section}>
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="rounded-xl border bg-card overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                {i > 0 && <div className="border-t" />}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
