
'use client';

import type { TrackedCrop } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Droplets, Trash2, Calendar } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

type CropTrackerProps = {
  crops: TrackedCrop[];
  onWater: (cropId: string) => void;
  onRemove: (cropId: string) => void;
};

export function CropTracker({ crops, onWater, onRemove }: CropTrackerProps) {
    return (
        <div className="space-y-6">
        <h2 className="font-headline text-3xl font-bold tracking-tight">My Garden</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {crops.map((crop) => {
            const dataAiHint = crop.name.toLowerCase().split(' ').slice(0, 2).join(' ');
            return (
                <Card key={crop.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
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
                <CardHeader className='pb-2'>
                    <CardTitle className="font-headline text-xl">{crop.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Planted on {format(crop.plantedDate, 'MMM d, yyyy')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col justify-between space-y-4">
                    <div>
                    <h4 className="mb-2 font-semibold">Watering Log</h4>
                    <TooltipProvider>
                        <div className="flex flex-wrap gap-2">
                        {crop.wateringLog.length > 0 ? (
                            crop.wateringLog.slice(-14).map((date, i) => (
                            <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <Droplets className="h-4 w-4" />
                                </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                <p>Watered {formatDistanceToNow(date, { addSuffix: true })}</p>
                                <p className="text-xs text-muted-foreground">{format(date, 'PPpp')}</p>
                                </TooltipContent>
                            </Tooltip>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No watering history yet. Give it a drink!</p>
                        )}
                        </div>
                    </TooltipProvider>
                    </div>
                    <div className="flex w-full gap-2 pt-4">
                    <Button className="flex-1" onClick={() => onWater(crop.id)}>
                        <Droplets className="mr-2 h-4 w-4" /> Water
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onRemove(crop.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                    </Button>
                    </div>
                </CardContent>
                </Card>
            );
            })}
        </div>
        </div>
    );
}
