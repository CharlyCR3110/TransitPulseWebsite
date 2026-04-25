import { PlannerScreen } from '@/features/planner/planner-screen';

interface PlannerPageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const params = await searchParams;
  return <PlannerScreen initialFrom={params.from} initialTo={params.to} />;
}
