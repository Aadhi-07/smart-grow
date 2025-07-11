"use client";

import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import { Leaf } from 'lucide-react';
import { useState } from 'react';
import { RecommendationForm } from './recommendation-form';
import { RecommendationResults } from './recommendation-results';
import { SensorDisplay } from './sensor-display';

export function TerraGrowDashboard() {
  const [recommendations, setRecommendations] = useState<CropRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center gap-3 rounded-full bg-primary/10 px-6 py-3 text-primary">
          <Leaf className="h-8 w-8" />
          <h1 className="font-headline text-4xl font-bold tracking-wider text-primary-foreground md:text-5xl">
            TerraGrow
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Your personal AI assistant for a thriving terrace garden. Get crop
          recommendations based on your space, climate, and soil.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <aside className="top-8 space-y-8 lg:col-span-1 lg:sticky">
          <RecommendationForm
            setRecommendations={setRecommendations}
            setIsLoading={setIsLoading}
            setError={setError}
          />
          <SensorDisplay />
        </aside>

        <main className="lg:col-span-2">
          <RecommendationResults
            recommendations={recommendations}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
}
