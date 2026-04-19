import { StopScreen } from '@/features/stops/stop-screen';

interface StopPageProps {
  params: Promise<{ stopId: string }>;
}

export default async function StopPage({ params }: StopPageProps) {
  const { stopId } = await params;
  return <StopScreen stopId={stopId} />;
}
