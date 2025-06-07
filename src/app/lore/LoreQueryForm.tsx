'use client';

import { useState } from 'react';
import { generateWhitePoopTheory, type WhitePoopTheoriesInput } from '@/ai/flows/white-poop-theories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoreQueryForm() {
  const [query, setQuery] = useState("What's the deal with white poop?");
  const [theory, setTheory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      toast({
        title: 'Hold your horses!',
        description: 'Please enter a query to explore the lore.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTheory(null);

    try {
      const input: WhitePoopTheoriesInput = { query };
      const result = await generateWhitePoopTheory(input);
      setTheory(result.theory);
      toast({
        title: 'Theory Generated!',
        description: 'Prepare for some "wisdom"... or something like it.',
      });
    } catch (error) {
      console.error('Error generating theory:', error);
      toast({
        title: 'Bummer!',
        description: 'Could not generate a theory. The oracle is asleep.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="lore-query" className="text-lg text-foreground">Your Burning Question:</Label>
          <Input
            id="lore-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Why is the poop white?"
            className="mt-1"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-primary-foreground">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Consulting Oracle...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Absurd Theory
            </>
          )}
        </Button>
      </form>

      {theory && (
        <Card className="mt-8 bg-secondary/50 border-accent shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-accent">Freshly Baked Theory!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg whitespace-pre-wrap text-secondary-foreground">{theory}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
