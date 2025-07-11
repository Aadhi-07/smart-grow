'use client';

import Image from 'next/image';

export function CropImage({cropName}: {cropName: string}) {
  const dataAiHint = cropName.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <div className="relative h-48 w-full">
      <Image
        src={`https://placehold.co/400x300.png`}
        alt={`Placeholder image for ${cropName}`}
        layout="fill"
        objectFit="cover"
        data-ai-hint={dataAiHint}
      />
    </div>
  );
}
