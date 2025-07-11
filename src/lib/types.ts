
import type { RecommendedCrop } from "@/ai/flows/crop-recommendation";

export type TrackedCrop = RecommendedCrop & {
    id: string;
    plantedDate: Date;
    wateringLog: Date[];
};

export type TerraceLayout = {
    rows: number;
    cols: number;
    grid: boolean[][];
};
