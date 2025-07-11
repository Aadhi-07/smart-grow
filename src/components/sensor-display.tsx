import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Sun, Thermometer } from "lucide-react";

export function SensorDisplay() {
  const sensorData = [
    { icon: Droplets, label: "Soil Moisture", value: "68%", color: "text-blue-500", iconBg: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-500 dark:text-blue-400" },
    { icon: Thermometer, label: "Temperature", value: "26°C", color: "text-orange-500", iconBg: "bg-orange-100 dark:bg-orange-900/50", iconColor: "text-orange-500 dark:text-orange-400" },
    { icon: Sun, label: "Light Level", value: "Bright", color: "text-yellow-500", iconBg: "bg-yellow-100 dark:bg-yellow-900/50", iconColor: "text-yellow-500 dark:text-yellow-400" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Conditions</CardTitle>
        <CardDescription>
          Optional sensor data from your garden.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
