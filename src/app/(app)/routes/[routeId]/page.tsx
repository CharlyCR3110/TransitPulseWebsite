import { RouteDetailScreen } from '@/features/routes/route-detail-screen';

interface RouteDetailPageProps {
  params: Promise<{ routeId: string }>;
}

export default async function RouteDetailPage({ params }: RouteDetailPageProps) {
  const { routeId } = await params;
  return <RouteDetailScreen routeId={routeId} />;
}
