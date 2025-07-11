'use client';

import { getWeatherForCity } from "@/ai/flows/weather-flow";
import type { WeatherOutput } from "@/ai/schemas/weather-schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets, Sun, Thermometer, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type SensorDisplayProps = {
  city: string;
};

export function SensorDisplay({ city }: SensorDisplayProps) {
  const [weather, setWeather] = useState<WeatherOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) {
        setWeather(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await getWeatherForCity({ city });
        setWeather(result);
      } catch (e) {
        console.error("Failed to fetch weather", e);
        setError("Could not load live conditions for this city.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  const sensorData = weather
    ? [
        { icon: Droplets, label: "Humidity", value: `${weather.humidity.toFixed(0)}%`, iconBg: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-500 dark:text-blue-400" },
        { icon: Thermometer, label: "Temperature", value: `${weather.temperature.toFixed(0)}°C`, iconBg: "bg-orange-100 dark:bg-orange-900/50", iconColor: "text-orange-500 dark:text-orange-400" },
        { icon: Sun, label: "Light Level", value: weather.lightLevel, iconBg: "bg-yellow-100 dark:bg-yellow-900/50", iconColor: "text-yellow-500 dark:text-yellow-400" },
      ]
    : [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-6 w-[50px]" />
                    </div>
                </div>
            ))}
        </div>
      );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!weather) {
      return <p className="text-sm text-muted-foreground">Enter a city to see live conditions.</p>
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {sensorData.map((sensor) => (
            <div key={sensor.label} className="flex items-center gap-4 rounded-lg border p-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${sensor.iconBg}`}>
                <sensor.icon className={`h-6 w-6 ${sensor.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{sensor.label}</p>
                <p className="text-xl font-bold">{sensor.value}</p>
              </div>
            </div>
          ))}
        </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Conditions in {city || '...'}</CardTitle>
        <CardDescription>
          Real-time sensor data from your garden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
