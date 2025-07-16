'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { findProduct, type FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Lightbulb, Search } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full btn-gradient">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Finding...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Find My Perfect Device
        </>
      )}
    </Button>
  );
}

export default function ProductFinderPage() {
  const [state, formAction] = useFormState(findProduct, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message.replace('Error: ', ''),
      });
    }
  }, [state, toast]);


  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto">
        <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">AI Product Finder</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell us what you need, and our AI will search our inventory to find the perfect device for you.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto mt-12 grid lg:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Describe Your Needs</CardTitle>
            <CardDescription>The more detail you provide, the better the recommendation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="specs" className="font-semibold">What specifications are you looking for?</Label>
                <Textarea
                  id="specs"
                  name="specs"
                  placeholder="e.g., 'A laptop with a great screen for photo editing, at least 16GB RAM, and a fast processor. Must be lightweight.'"
                  className="min-h-[120px]"
                />
                 {state.errors?.specs && <p className="text-sm text-destructive">{state.errors.specs[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageScenario" className="font-semibold">How will you be using this device?</Label>
                <Textarea
                  id="usageScenario"
                  name="usageScenario"
                  placeholder="e.g., 'I'm a university student who needs to write papers, browse the web, and occasionally play games like Valorant.'"
                   className="min-h-[120px]"
                />
                {state.errors?.usageScenario && <p className="text-sm text-destructive">{state.errors.usageScenario[0]}</p>}
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <div className="row-start-1 lg:row-auto">
          <Card className="bg-secondary h-full flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">AI Recommendation</CardTitle>
              <CardDescription>The best match for your needs will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {state.result ? (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle className="font-headline font-bold text-lg">{state.result.productName}</AlertTitle>
                  <AlertDescription>
                    <p className="mt-2 font-semibold">Justification:</p>
                    <p>{state.result.justification}</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Your recommended product will be shown here once you submit your request.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
