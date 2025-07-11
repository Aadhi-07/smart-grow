
import type { CropRecommendationOutput } from "@/ai/flows/crop-recommendation";

export type TrackedCrop = CropRecommendationOutput['crops'][0] & {
    id: string;
    plantedDate: Date;
    wateringLog: Date[];
};
