
"use client";

import type { CropRecommendationOutput, RecommendedCrop } from '@/ai/flows/crop-recommendation';
import { Leaf } from 'lucide-react';
import { useState } from 'react';
import { RecommendationForm } from './recommendation-form';
import { RecommendationResults } from './recommendation-results';
import { SensorDisplay } from './sensor-display';
import { Chatbot } from './chatbot';
import { CropTracker } from './crop-tracker';
import type { TrackedCrop, TerraceLayout } from '@/lib/types';

const createEmptyLayout = (rows: number, cols: number): TerraceLayout => ({
  rows,
  cols,
  grid: Array.from({ length: rows }, () => Array(cols).fill(false)),
});


export function TerraGrowDashboard() {
  const [recommendations, setRecommendations] = useState<CropRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedCrops, setTrackedCrops] = useState<TrackedCrop[]>([]);
  const [terraceLayout, setTerraceLayout] = useState<TerraceLayout>(createEmptyLayout(15, 15));


  const handlePlantCrop = (crop: RecommendedCrop) => {
    const isPlanted = trackedCrops.some(tc => tc.name === crop.name);
    if (isPlanted) return;

    const newCrop: TrackedCrop = {
      ...crop,
      id: `${crop.name}-${new Date().getTime()}`,
      plantedDate: new Date(),
      wateringLog: [],
    };
    setTrackedCrops((prev) => [...prev, newCrop]);
  };

  const handleWaterCrop = (cropId: string) => {
    setTrackedCrops((prev) =>
      prev.map((crop) =>
        crop.id === cropId
          ? { ...crop, wateringLog: [...crop.wateringLog, new Date()] }
          : crop
      )
    );
  };

  const handleRemoveCrop = (cropId: string) => {
    setTrackedCrops((prev) => prev.filter((crop) => crop.id !== cropId));
  };

  const handleSetRecommendations = (data: CropRecommendationOutput | null) => {
      setRecommendations(data);
  };

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
          recommendations and a custom layout for your space.
        </p>
      </header>
      
      {trackedCrops.length > 0 && (
        <CropTracker 
          crops={trackedCrops} 
          onWater={handleWaterCrop}
          onRemove={handleRemoveCrop}
        />
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <aside className="top-8 space-y-8 lg:col-span-1 lg:sticky">
          <RecommendationForm
            setRecommendations={handleSetRecommendations}
            setIsLoading={setIsLoading}
            setError={setError}
            terraceLayout={terraceLayout}
            setTerraceLayout={setTerraceLayout}
          />
          <SensorDisplay />
        </aside>

        <main className="lg:col-span-2">
          <RecommendationResults
            recommendations={recommendations}
            isLoading={isLoading}
            error={error}
            onPlantCrop={handlePlantCrop}
            trackedCrops={trackedCrops}
            terraceLayout={terraceLayout}
          />
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
