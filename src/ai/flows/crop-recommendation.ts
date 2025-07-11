
'use server';

/**
 * @fileOverview A crop recommendation and layout AI agent.
 *
 * - recommendCropsAndLayout - A function that suggests crops based on various factors and provides a layout.
 * - CropRecommendationAndLayoutInput - The input type for the recommendCropsAndLayout function.
 * - CropRecommendationAndLayoutOutput - The return type for the recommendCropsAndLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for a single recommended crop
const RecommendedCropSchema = z.object({
  name: z.string().describe('The name of the recommended crop.'),
  season: z.string().describe('The season when the crop grows best.'),
  careTips: z.string().describe('Tips for taking care of the crop, formatted as a bulleted list.'),
  estimatedYield: z.string().describe('The estimated yield per plant or per square foot.'),
  plantSize: z.object({
    width: z.number().describe('The approximate width of a mature plant in feet.'),
    height: z.number().describe('The approximate height of a mature plant in feet.'),
  }).describe('The approximate size of a mature plant.'),
});
export type RecommendedCrop = z.infer<typeof RecommendedCropSchema>;


// Input Schema
const CropRecommendationAndLayoutInputSchema = z.object({
  terraceAreaSqft: z
    .number()
    .describe('The terrace area in square feet.'),
  city: z.string().describe('The city where the terrace is located.'),
  month: z.string().describe('The current month.'),
  soilType: z.string().optional().describe('The type of soil (optional).'),
  terraceLayout: z.array(z.array(z.boolean())).describe('A 2D grid representing the terrace layout, where `true` is a plantable tile and `false` is not. Each tile is 1x1 sqft.'),
});
export type CropRecommendationAndLayoutInput = z.infer<typeof CropRecommendationAndLayoutInputSchema>;


// Output Schema
const CropLayoutPlacementSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  position: z.object({
    row: z.number().describe('The row index for the top-left corner of the plant.'),
    col: z.number().describe('The column index for the top-left corner of the plant.'),
  }).describe('The position of the plant on the grid.'),
});

const CropRecommendationAndLayoutOutputSchema = z.object({
  crops: z.array(RecommendedCropSchema).describe('A list of recommended crops.'),
  layout: z.array(CropLayoutPlacementSchema).describe('The positions of each crop on the terrace grid.'),
});
export type CropRecommendationAndLayoutOutput = z.infer<typeof CropRecommendationAndLayoutOutputSchema>;


// Recommendation and Layout Flow Implementation
const recommendAndLayoutPrompt = ai.definePrompt({
  name: 'recommendAndLayoutPrompt',
  input: {schema: CropRecommendationAndLayoutInputSchema},
  output: {schema: CropRecommendationAndLayoutOutputSchema},
  prompt: `You are an expert agricultural advisor and garden planner for terrace farms.
  Your task is to perform two steps:
  1. Recommend the top 5 most suitable crops based on the provided details.
  2. Create an optimal layout for planting those recommended crops on the provided terrace grid.

  DETAILS:
  - Terrace Area: {{terraceAreaSqft}} sqft
  - Location: {{city}}
  - Month: {{month}}
  - Soil Type: {{soilType}}
  - Terrace Layout (rows x cols, where 'T' is plantable):
    {{#each terraceLayout as |row|}}
      {{#each row as |cell|}}{{#if cell}}T{{else}}F{{/if}}{{/each}}
    {{/each}}

  STEP 1: CROP RECOMMENDATION
  Analyze the inputs to recommend crops that thrive in the local climate for the given month. For each crop, provide:
  - The common name.
  - The best growing season.
  - Actionable care tips in a bulleted list format.
  - An estimated yield (e.g., "2-3 kgs per plant").
  - An estimated mature plant size (width and height in feet).

  STEP 2: CROP LAYOUT
  Using the crops you just recommended, determine the optimal placement on the terrace grid. Follow these rules:
  - Place each recommended crop exactly once.
  - The position (row, col) should be the top-left corner of the area the plant will occupy.
  - A plant's area must fit entirely within the plantable ('T') tiles.
  - Plant areas must not overlap.
  - Consider plant heights. Try not to place taller plants where they will cast excessive shade on shorter plants, assuming sunlight comes from the 'top' of the grid (lower row indices).
  - The 'cropName' in the layout output must exactly match the name from your recommendations.

  CRITICAL: Your entire response must be a single, valid JSON object that strictly adheres to the provided output schema, containing both the 'crops' and 'layout' fields. Do NOT include any text, conversation, apologies, or markdown formatting like \`\`\`json before or after the JSON object.
  `,
});

const recommendCropsAndLayoutFlow = ai.defineFlow(
  {
    name: 'recommendCropsAndLayoutFlow',
    inputSchema: CropRecommendationAndLayoutInputSchema,
    outputSchema: CropRecommendationAndLayoutOutputSchema,
  },
  async input => {
    const {output} = await recommendAndLayoutPrompt(input);
    return output!;
  }
);

export async function recommendCropsAndLayout(input: CropRecommendationAndLayoutInput): Promise<CropRecommendationAndLayoutOutput> {
  return recommendCropsAndLayoutFlow(input);
}
