'use server';
/**
 * @fileOverview Generates an image based on a text prompt.
 *
 * - generateImage - A function that handles image generation.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Simple in-memory cache to avoid hitting rate limits for the same prompts.
const imageCache = new Map<string, string>();

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({prompt}) => {
    // Check cache first
    if (imageCache.has(prompt)) {
      return {imageUrl: imageCache.get(prompt)!};
    }

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `a vibrant, high-quality photograph of a healthy ${prompt} in a terrace garden setting, with natural sunlight`,
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }
    
    // Store in cache
    imageCache.set(prompt, media.url);

    return {imageUrl: media.url};
  }
);
