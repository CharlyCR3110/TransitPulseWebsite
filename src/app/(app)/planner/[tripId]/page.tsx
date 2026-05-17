import { TripDetailScreen } from '@/features/planner/trip-detail-screen';

interface TripDetailPageProps {
  params: Promise<{ tripId: string }>;
  searchParams?: Promise<{ departureAt?: string }>;
}

export default async function TripDetailPage({ params, searchParams }: TripDetailPageProps) {
  const { tripId } = await params;
  const query = searchParams ? await searchParams : {};
  return <TripDetailScreen tripId={tripId} departureAt={query.departureAt} />;
}
