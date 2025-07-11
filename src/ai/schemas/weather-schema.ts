/**
 * @fileOverview Schemas for the weather flow.
 */
import { z } from 'genkit';

// Input Schema
export const WeatherInputSchema = z.object({
  city: z.string().describe('The city to get the weather for.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

// Output Schema
export const WeatherOutputSchema = z.object({
  temperature: z.number().describe('The temperature in Celsius.'),
  humidity: z.number().describe('The soil moisture or humidity percentage.'),
  lightLevel: z.enum(['Low', 'Medium', 'Bright']).describe('The general light level.'),
});
export type WeatherOutput = z.infer<typeof WeatherOutputSchema>;
