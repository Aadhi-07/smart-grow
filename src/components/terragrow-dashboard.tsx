
"use client";

import type { CropRecommendationAndLayoutOutput, RecommendedCrop } from '@/ai/flows/crop-recommendation';
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
            <path d="M50 95C25.1 89 12.5 54.7 10 50C12.5 45.3 25.1 11 50 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0s' }}/>
            <path d="M12 55.4C17.4 50.8 22.8 45.1 26 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0.5s' }}/>
            <path d="M26 40c-2.9 6.3-5.2 13-10.4 16.4" fill="currentColor" className="vine-path" style={{ animationDelay: '0.8s' }}/>
            <path d="M22 74.4C27.9 69.2 33.6 62.9 37.5 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0.6s' }}/>
            <path d="M37.5 56c-3 6.1-5.6 12.6-11.2 17.4" fill="currentColor" className="vine-path" style={{ animationDelay: '0.9s' }}/>
            <path d="M22.5 25.6C28.2 30.6 33.3 36.3 36.5 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0.7s' }}/>
            <path d="M36.5 42c-2.9-6-5.4-12.4-11.2-17.1" fill="currentColor" className="vine-path" style={{ animationDelay: '1s' }}/>
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
            <path d="M50 95C74.9 89 87.5 54.7 90 50C87.5 45.3 74.9 11 50 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0s' }}/>
            <path d="M88 55.4C82.6 50.8 77.2 45.1 74 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0.5s' }}/>
            <path d="M74 40c2.9 6.3 5.2 13 10.4 16.4" fill="currentColor" className="vine-path" style={{ animationDelay: '0.8s' }}/>
            <path d="M78 74.4C72.1 69.2 66.4 62.9 62.5 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0.6s' }}/>
            <path d="M62.5 56c3 6.1 5.6 12.6 11.2 17.4" fill="currentColor" className="vine-path" style={{ animationDelay: '0.9s' }}/>
            <path d="M77.5 25.6C71.8 30.6 66.7 36.3 63.5 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="vine-path" style={{ animationDelay: '0.7s' }}/>
            <path d="M63.5 42c2.9-6 5.4-12.4 11.2-17.1" fill="currentColor" className="vine-path" style={{ animationDelay: '1s' }}/>
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
