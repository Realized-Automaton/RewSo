
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'White Poop Lore | Rewind Society',
  description: 'Explore the absurd and hilarious theories behind "White Poop" at Rewind Society.',
};

export default function LorePage() {
  const audioUrl = "https://raw.githubusercontent.com/Realized-Automaton/ABC-DE-FI/main/public/tpp.mp3";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://i.ibb.co/TMYsm8q4/a-long-hallway-with-children-s-book-on-either-side.jpg')" }}
    >
      <div className="min-h-screen space-y-8 p-4 md:p-8 backdrop-blur-sm flex flex-col items-center">
        
        <Card className="neon-border w-full max-w-2xl bg-card/60 mt-8">
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-center">
              <Image
                src="https://i.ibb.co/gFFPzZMy/page-1.png"
                alt="Mysterious Book Page - White Poop Lore"
                width={600}
                height={800} 
                className="rounded-md shadow-lg border-2 border-accent object-contain max-h-[70vh]"
                data-ai-hint="mysterious manuscript"
              />
            </div>

            <div className="text-center p-4 rounded-lg bg-card/50 border border-dashed border-accent">
              <Headphones className="h-12 w-12 text-accent mx-auto mb-2" />
              <h3 className="text-xl text-primary mb-2">Hear the Lore! (Audio Chapter)</h3>
              {audioUrl ? (
                <audio controls className="w-full max-w-md mx-auto">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Audiobook reading of this chapter coming soon... stay tuned for the spine-chilling narration!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
