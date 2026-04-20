import { Suspense } from 'react';
import { ActiveTripScreen } from '@/features/planner/active-trip-screen';

export default function ActiveTripPage() {
  return (
    <Suspense>
      <ActiveTripScreen />
    </Suspense>
  );
}
