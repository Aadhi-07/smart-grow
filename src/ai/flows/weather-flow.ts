'use server';

/**
 * @fileOverview A weather information agent.
 *
 * - getWeatherForCity - A function that gets weather data for a city.
 */

import { ai } from '@/ai/genkit';
import { WeatherInput, WeatherInputSchema, WeatherOutput, WeatherOutputSchema } from '../schemas/weather-schema';
export type { WeatherInput, WeatherOutput };

// This tool simulates fetching weather data.
// In a real application, this would call a weather API.
const getWeatherTool = ai.defineTool(
  {
    name: 'getWeatherTool',
    description: 'Get simulated weather conditions for a specific city.',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
  },
  async ({ city }) => {
    // Simple hashing function to get consistent "random" data per city
    let hash = 0;
    for (let i = 0; i < city.length; i++) {
      const char = city.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }

    const temp = 20 + (Math.abs(hash) % 15); // Temp between 20-34
    const humidity = 40 + (Math.abs(hash * 2) % 45); // Humidity between 40-84
    const lightVal = Math.abs(hash * 3) % 3;
    const lightLevel = (['Low', 'Medium', 'Bright'] as const)[lightVal];
    
    return {
      temperature: temp,
      humidity: humidity,
      lightLevel: lightLevel,
    };
  }
);

const getWeatherFlow = ai.defineFlow(
  {
    name: 'getWeatherFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
  },
  async (input) => {
    // Call the tool directly to ensure we get the correct output format.
    return await getWeatherTool(input);
  }
);


export async function getWeatherForCity(input: WeatherInput): Promise<WeatherOutput> {
  return getWeatherFlow(input);
}
