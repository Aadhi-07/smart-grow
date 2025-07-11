"use client";

import { recommendCropsAndLayout, type CropRecommendationAndLayoutOutput } from '@/ai/flows/crop-recommendation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sprout } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TerracePlanner } from './terrace-planner';
import type { TerraceLayout } from '@/lib/types';

const formSchema = z.object({
  city: z.string().min(2, { message: "City is required." }),
  month: z.string({ required_error: "Please select a month." }),
  soilType: z.string().optional(),
  layout: z.custom<TerraceLayout>()
    .refine((layout) => layout.grid.flat().some(cell => cell), {
        message: "Please draw your terrace layout. At least one tile must be selected."
    }),
});

type RecommendationFormProps = {
  setRecommendations: (data: CropRecommendationAndLayoutOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  terraceLayout: TerraceLayout;
  setTerraceLayout: (layout: TerraceLayout) => void;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function RecommendationForm({ setRecommendations, setIsLoading, setError, terraceLayout, setTerraceLayout }: RecommendationFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "Mumbai",
      soilType: "Loamy",
      month: months[new Date().getMonth()],
      layout: terraceLayout,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const plantableArea = values.layout.grid.flat().filter(Boolean).length;

    try {
      const result = await recommendCropsAndLayout({
        terraceAreaSqft: plantableArea,
        city: values.city,
        month: values.month,
        soilType: values.soilType,
        terraceLayout: values.layout.grid,
      });
      setRecommendations(result);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get recommendations: ${errorMessage}`);
      toast({
        title: "An Error Occurred",
        description: "We couldn't fetch crop recommendations. Please check your inputs and try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Garden</CardTitle>
        <CardDescription>
          Design your terrace and we'll suggest the perfect crops and layout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="layout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terrace Layout (1 tile = 1x1 sq ft)</FormLabel>
                  <FormControl>
                     <TerracePlanner layout={field.value} onChange={(newLayout) => {
                        setTerraceLayout(newLayout);
                        field.onChange(newLayout);
                     }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bangalore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Month</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Type (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Loamy, Sandy, Clay" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <Sprout className="mr-2 h-4 w-4" />
              Get Recommendations
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
