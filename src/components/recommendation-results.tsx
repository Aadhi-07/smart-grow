"use client";

import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Bot, Info, Package, Waves } from 'lucide-react';
import Image from 'next/image';
import { CropImage } from './crop-image';

type RecommendationResultsProps = {
  recommendations: CropRecommendationOutput | null;
  isLoading: boolean;
  error: string | null;
};

export function RecommendationResults({ recommendations, isLoading, error }: RecommendationResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
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
          Fill out the form to let our AI assistant discover the best plants for your terrace. Your green journey starts here!
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
      <h2 className="font-headline text-3xl font-bold tracking-tight">
        Your Recommended Crops
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {recommendations.crops.map((crop, index) => (
          <Card key={`${crop.name}-${index}`} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
            <CropImage cropName={crop.name} />
            <CardHeader>
              <CardTitle className="font-headline text-xl">{crop.name}</CardTitle>
              <CardDescription>Best Season: {crop.season}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
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
          </Card>
        ))}
      </div>
    </div>
  );
}
