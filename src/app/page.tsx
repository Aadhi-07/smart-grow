import { TerraGrowDashboard } from '@/components/terragrow-dashboard';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <TerraGrowDashboard />
      </main>
    </Suspense>
  );
}
