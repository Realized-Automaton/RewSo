
'use client';

import { useState } from 'react';
import { generateSticker, type GenerateStickerInput } from '@/ai/flows/generate-sticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function StickerForm() {
  const [prompt, setPrompt] = useState('');
  const [stickerDataUri, setStickerDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: 'Uh oh!',
        description: 'Please enter a prompt for your sticker.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setStickerDataUri(null);

    try {
      const input: GenerateStickerInput = { prompt };
      const result = await generateSticker(input);
      setStickerDataUri(result.stickerDataUri);
      toast({
        title: 'Success!',
        description: 'Your stinky sticker is ready!',
      });
    } catch (error) {
      console.error('Error generating sticker:', error);
      toast({
        title: 'Error!',
        description: 'Could not generate sticker. Maybe the bears are on strike?',
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
          <Label htmlFor="sticker-prompt" className="text-lg text-foreground">Sticker Prompt:</Label>
          <Input
            id="sticker-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A bear picking its nose with a honey dipper"
            className="mt-1"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-primary-foreground">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Sticker'
          )}
        </Button>
      </form>

      {stickerDataUri && (
        <div className="mt-6 md:mt-8 p-4 border-2 border-dashed border-accent rounded-lg text-center bg-background">
          <h3 className="text-xl sm:text-2xl text-primary mb-4">Your Masterpiece!</h3>
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square">
            <Image 
              src={stickerDataUri} 
              alt="Generated Sticker" 
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-md shadow-lg border-4 border-primary"
              data-ai-hint="sticker parody"
              unoptimized={true} 
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 400px"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">(Hopefully it's as gross as you imagined!)</p>
        </div>
      )}
    </div>
  );
}
