'use client';

import {generateImage} from '@/ai/flows/generate-image';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Skeleton} from './ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from './ui/alert';
import {AlertCircle} from 'lucide-react';

export function CropImage({cropName}: {cropName: string}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateImage({prompt: `${cropName} plant`});
        setImageUrl(result.imageUrl);
      } catch (e) {
        console.error(`Failed to generate image for ${cropName}:`, e);
        setError('Could not load image.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchImage();
  }, [cropName]);

  return (
    <div className="relative h-48 w-full">
      {isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      {imageUrl && !isLoading && (
        <Image
          src={imageUrl}
          alt={`AI-generated image of ${cropName}`}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-500 ease-in-out opacity-0"
          onLoadingComplete={(image) => image.classList.remove('opacity-0')}
        />
      )}
    </div>
  );
}
