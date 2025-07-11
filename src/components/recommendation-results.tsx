
"use client";

import { type CropRecommendationAndLayoutOutput, type RecommendedCrop } from '@/ai/flows/crop-recommendation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Bot, Info, Package, PlusCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import type { TerraceLayout, TrackedCrop } from '@/lib/types';
import { cn } from '@/lib/utils';

type RecommendationResultsProps = {
  recommendations: CropRecommendationAndLayoutOutput | null;
  isLoading: boolean;
  error: string | null;
  onPlantCrop: (crop: RecommendedCrop) => void;
  trackedCrops: TrackedCrop[];
  terraceLayout: TerraceLayout;
};

const cropColors = [
    'bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300',
    'bg-pink-300', 'bg-indigo-300', 'bg-teal-300', 'bg-orange-300', 'bg-lime-300'
];

export function RecommendationResults({ recommendations, isLoading, error, onPlantCrop, trackedCrops, terraceLayout }: RecommendationResultsProps) {
  
  const getCropColor = (cropName: string) => {
    const cropIndex = recommendations?.crops.findIndex(c => c.name === cropName) ?? -1;
    return cropColors[cropIndex % cropColors.length];
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-8 w-1/2 mt-6" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <Skeleton className="h-[200px] w-full rounded-t-lg" />
                <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!recommendations) {
    return (
      <Card className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 rounded-full border bg-primary/10 p-4 text-primary">
          <Bot className="h-12 w-12" />
        </div>
        <CardTitle className="mb-2 font-headline text-2xl">
          Ready to Grow?
        </CardTitle>
        <CardDescription className="max-w-sm">
          Draw your terrace layout and fill out the form to let our AI assistant discover the best plants and arrangement for your garden.
        </CardDescription>
      </Card>
    );
  }
  
  if (recommendations.crops.length === 0) {
    return (
       <Card className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 rounded-full border bg-accent/10 p-4 text-accent">
          <Info className="h-12 w-12" />
        </div>
        <CardTitle className="mb-2 font-headline text-2xl">
          No Recommendations Found
        </CardTitle>
        <CardDescription className="max-w-sm">
          We couldn't find any specific crop recommendations for the provided details. Please try adjusting your inputs.
        </CardDescription>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Your Garden Layout</CardTitle>
                <CardDescription>Here's the optimal placement for your crops on your terrace.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-lg bg-card overflow-x-auto">
                    <div
                        className="relative terrace-grid gap-1 aspect-square bg-muted/20"
                        style={{
                            '--rows': terraceLayout.rows,
                            '--cols': terraceLayout.cols,
                            'minWidth': `${terraceLayout.cols * 2.5}rem`
                        } as React.CSSProperties}
                    >
                        {terraceLayout.grid.map((row, r) =>
                            row.map((isPlantable, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    className={cn(
                                        'w-full h-full rounded-sm',
                                        isPlantable ? 'bg-green-100 border border-green-200' : 'bg-muted/30'
                                    )}
                                />
                            ))
                        )}
                        {recommendations.layout.map(({ cropName, position }, index) => {
                            const cropDetails = recommendations.crops.find(c => c.name === cropName);
                            if (!cropDetails) return null;
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "absolute rounded-md flex items-center justify-center text-xs font-bold text-gray-800 p-1 text-center transition-all duration-300",
                                        getCropColor(cropName)
                                    )}
                                    style={{
                                        gridRowStart: position.row + 1,
                                        gridColumnStart: position.col + 1,
                                        gridRowEnd: position.row + Math.round(cropDetails.plantSize.height) + 1,
                                        gridColumnEnd: position.col + Math.round(cropDetails.plantSize.width) + 1,
                                    }}
                                    title={cropName}
                                >
                                   <span className="truncate">{cropName}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>

      <h2 className="font-headline text-3xl font-bold tracking-tight">
        Your Recommended Crops
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {recommendations.crops.map((crop, index) => {
          const isPlanted = trackedCrops.some(tc => tc.name === crop.name);
          const dataAiHint = crop.name.toLowerCase().split(' ').slice(0, 2).join(' ');
          return (
            <Card key={`${crop.name}-${index}`} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
              <div className="relative h-48 w-full">
                <Image
                  src={`https://placehold.co/400x300.png`}
                  alt={`Placeholder image for ${crop.name}`}
                  fill={true}
                  style={{objectFit: 'cover'}}
                  className="rounded-t-lg"
                  data-ai-hint={dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <span className={cn('w-4 h-4 rounded-full', getCropColor(crop.name))}></span>
                    {crop.name}
                </CardTitle>
                <CardDescription>Best Season: {crop.season}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col space-y-4">
                 <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Package className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>
                    <strong>Est. Yield:</strong> {crop.estimatedYield}
                  </span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="care-tips">
                    <AccordionTrigger>Care Tips</AccordionTrigger>
                    <AccordionContent className="whitespace-pre-wrap font-body text-base">
                      {crop.careTips}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                  <Button className="w-full" onClick={() => onPlantCrop(crop)} disabled={isPlanted}>
                      {isPlanted ? <CheckCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {isPlanted ? 'Planted' : 'Plant this Crop'}
                  </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
