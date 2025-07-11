// src/ai/flows/crop-recommendation.ts
'use server';

/**
 * @fileOverview A crop recommendation AI agent that suggests crops based on terrace area, location, and season.
 *
 * - recommendCrops - A function that handles the crop recommendation process.
 * - CropRecommendationInput - The input type for the recommendCrops function.
 * - CropRecommendationOutput - The return type for the recommendCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  terraceAreaSqft: z
    .number()
    .describe('The terrace area in square feet.'),
  city: z.string().describe('The city where the terrace is located.'),
  month: z.string().describe('The current month.'),
  soilType: z.string().optional().describe('The type of soil (optional).'),
});
export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  crops: z.array(
    z.object({
      name: z.string().describe('The name of the recommended crop.'),
      season: z.string().describe('The season when the crop grows best.'),
      careTips: z.string().describe('Tips for taking care of the crop.'),
    })
  ).describe('A list of recommended crops.'),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return recommendCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor, specializing in terrace farms.

  Based on the terrace area, location, and current month, recommend the top 5 crops that are most suitable for planting.

  Terrace Area: {{terraceAreaSqft}} sqft
  Location: {{city}}
  Month: {{month}}
  Soil Type: {{soilType}}

  Consider the local climate and typical weather conditions for the given location and month.
  Provide specific care tips for each recommended crop.

  Format your repsonse as a valid JSON object.
  `,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
