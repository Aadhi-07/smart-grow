
"use client";

import type { CropRecommendationAndLayoutOutput, RecommendedCrop } from '@/ai/flows/crop-recommendation';
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
  const [recommendations, setRecommendations] = useState<CropRecommendationAndLayoutOutput | null>(null);
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

  const handleSetRecommendations = (data: CropRecommendationAndLayoutOutput | null) => {
      setRecommendations(data);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center justify-center gap-1 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <svg
                className="h-16 w-16 -mr-4 text-primary"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 95C20 90 10 50 10 50S20 10 50 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="vine-path"
                  style={{ animationDelay: '0.2s' }}
                />
                <path d="M10 50C15 45 20 45 20 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="vine-path" style={{ animationDelay: '0.8s' }} />
                <path d="M25 75C30 70 35 70 35 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="vine-path" style={{ animationDelay: '0.6s' }} />
                <path d="M30 25C35 30 40 30 40 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="vine-path" style={{ animationDelay: '1s' }} />
            </svg>
          <h1 className="font-headline text-4xl font-bold tracking-wider text-primary-foreground text-glow py-3 md:text-5xl">
            TerraGrow
          </h1>
          <svg
                className="h-16 w-16 -ml-4 text-primary"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 95C80 90 90 50 90 50S80 10 50 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="vine-path"
                  style={{ animationDelay: '0.2s' }}
                />
                <path d="M90 50C85 45 80 45 80 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="vine-path" style={{ animationDelay: '0.8s' }} />
                <path d="M75 75C70 70 65 70 65 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="vine-path" style={{ animationDelay: '0.6s' }} />
                <path d="M70 25C65 30 60 30 60 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="vine-path" style={{ animationDelay: '1s' }} />
              </svg>
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
