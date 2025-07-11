
'use server';

/**
 * @fileOverview A crop recommendation and layout AI agent.
 *
 * - recommendCrops - A function that suggests crops based on various factors.
 * - layoutCrops - A function that suggests a layout for the crops on a terrace.
 * - CropRecommendationInput - The input type for the recommendCrops function.
 * - CropRecommendationOutput - The return type for the recommendCrops function.
 * - CropLayoutInput - The input type for the layoutCrops function.
 * - CropLayoutOutput - The return type for the layoutCrops function.
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

// Input and Output for Crop Recommendation Flow
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
  crops: z.array(RecommendedCropSchema).describe('A list of recommended crops.'),
});
export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;


// Input and Output for Crop Layout Flow
const CropLayoutInputSchema = z.object({
    terraceLayout: z.array(z.array(z.boolean())).describe('A 2D grid representing the terrace layout, where `true` is a plantable tile and `false` is not. Each tile is 1x1 sqft.'),
    cropsToPlant: z.array(RecommendedCropSchema).describe('The list of crops that need to be placed on the terrace.'),
});
export type CropLayoutInput = z.infer<typeof CropLayoutInputSchema>;

const CropLayoutOutputSchema = z.object({
  layout: z.array(
    z.object({
      cropName: z.string().describe('The name of the crop.'),
      position: z.object({
        row: z.number().describe('The row index for the top-left corner of the plant.'),
        col: z.number().describe('The column index for the top-left corner of the plant.'),
      }).describe('The position of the plant on the grid.'),
    })
  ).describe('The positions of each crop on the terrace grid.'),
});
export type CropLayoutOutput = z.infer<typeof CropLayoutOutputSchema>;


// Recommendation Flow Implementation
const recommendPrompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agricultural advisor for terrace farms. Your task is to recommend the top 5 most suitable crops based on the provided details.

  Terrace Area: {{terraceAreaSqft}} sqft
  Location: {{city}}
  Month: {{month}}
  Soil Type: {{soilType}}

  Analyze the inputs to recommend crops that thrive in the local climate for the given month. For each crop, provide:
  - The common name.
  - The best growing season.
  - Actionable care tips in a bulleted list format.
  - An estimated yield (e.g., "2-3 kgs per plant").
  - An estimated mature plant size (width and height in feet).

  CRITICAL: Your entire response must be a single, valid JSON object that strictly adheres to the provided output schema. Do NOT include any text, conversation, apologies, or markdown formatting like \`\`\`json before or after the JSON object.
  `,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await recommendPrompt(input);
    return output!;
  }
);

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return recommendCropsFlow(input);
}


// Layout Flow Implementation
const layoutPrompt = ai.definePrompt({
    name: 'cropLayoutPrompt',
    input: {schema: CropLayoutInputSchema},
    output: {schema: CropLayoutOutputSchema},
    prompt: `You are an expert garden planner. Your task is to create an optimal layout for planting crops on a terrace.

    You will be given a 2D grid representing the plantable area of the terrace. Each 'true' cell in the grid is a 1x1 sqft tile where plants can be placed.
    You will also be given a list of crops to plant, along with their mature sizes.

    Your goal is to position each crop on the grid. Here are the rules:
    1.  Place each crop from the \`cropsToPlant\` list exactly once.
    2.  The position (row, col) should be the top-left corner of the area the plant will occupy.
    3.  A plant's area must fit entirely within the plantable (true) tiles of the terrace layout.
    4.  The areas occupied by different plants must not overlap.
    5.  Consider plant heights. Try not to place taller plants where they will cast excessive shade on shorter plants, assuming sunlight comes from the 'top' of the grid (lower row indices).
    6.  The \`cropName\` in the output must exactly match the name from the input.

    Terrace Layout (rows x cols, where true is plantable):
    {{#each terraceLayout as |row|}}
      {{#each row as |cell|}}{{#if cell}}T{{else}}F{{/if}}{{/each}}
    {{/each}}

    Crops to Plant (with their sizes in feet):
    {{#each cropsToPlant}}
    - {{name}}: {{plantSize.width}}ft x {{plantSize.height}}ft (height: {{plantSize.height}}ft)
    {{/each}}

    CRITICAL: Your entire response must be a single, valid JSON object that strictly adheres to the provided output schema. Do NOT include any text, conversation, apologies, or markdown formatting like \`\`\`json before or after the JSON object.
    `,
});

const layoutCropsFlow = ai.defineFlow(
    {
        name: 'layoutCropsFlow',
        inputSchema: CropLayoutInputSchema,
        outputSchema: CropLayoutOutputSchema,
    },
    async (input) => {
        const { output } = await layoutPrompt(input);
        return output!;
    }
);

export async function layoutCrops(input: CropLayoutInput): Promise<CropLayoutOutput> {
    return layoutCropsFlow(input);
}
