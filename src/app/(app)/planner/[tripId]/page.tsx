import { TripDetailScreen } from '@/features/planner/trip-detail-screen';

interface TripDetailPageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { tripId } = await params;
  return <TripDetailScreen tripId={tripId} />;
}
