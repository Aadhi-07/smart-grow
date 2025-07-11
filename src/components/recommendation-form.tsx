"use client";

import { recommendCrops, type CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sprout } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  length: z.coerce.number().positive({ message: "Must be a positive number." }).min(1),
  width: z.coerce.number().positive({ message: "Must be a positive number." }).min(1),
  city: z.string().min(2, { message: "City is required." }),
  month: z.string({ required_error: "Please select a month." }),
  soilType: z.string().optional(),
});

type RecommendationFormProps = {
  setRecommendations: (data: CropRecommendationOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function RecommendationForm({ setRecommendations, setIsLoading, setError }: RecommendationFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 10,
      width: 12,
      city: "Mumbai",
      soilType: "Loamy",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const terraceAreaSqft = values.length * values.width;

    try {
      const result = await recommendCrops({
        terraceAreaSqft,
        city: values.city,
        month: values.month,
        soilType: values.soilType,
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
          Tell us about your space, and we'll suggest the perfect crops.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                  <FormDescription>
                    Providing soil type helps in better recommendations.
                  </FormDescription>
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
