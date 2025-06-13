
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lore | Rewind Society',
  description: 'Hear the chapter of the Poop Problem from the Rewind Society archives.',
};

export default function LorePage() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative" 
    >
      {/* Blurred Background Element */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm" 
        style={{ backgroundImage: "url('https://i.ibb.co/TMYsm8q4/a-long-hallway-with-children-s-book-on-either-side.jpg')" }}
        data-ai-hint="library hallway"
        aria-hidden="true"
      />

      {/* Content Card - layered on top */}
      <Card className="relative z-10 w-full max-w-xl bg-card/85 backdrop-blur-md shadow-2xl neon-border overflow-hidden">
        <CardContent className="p-4 md:p-6 space-y-4 flex flex-col items-center">
          <div className="relative w-full aspect-[1/1] max-w-[390px] sm:max-w-[455px]">
            <Image
              src="https://i.ibb.co/gFFPzZMy/page-1.png" 
              alt="Book cover illustration showing a bear cub looking at white poop" 
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-md shadow-lg"
              data-ai-hint="bear cub white poop" 
              unoptimized={true}
              priority
            />
          </div>

          <div className="text-center space-y-2 w-full pt-4 border-t-2 border-primary/30">
            <Headphones className="h-10 w-10 text-accent mx-auto animate-pulse" />
            <p className="text-xl font-pixel font-semibold text-primary">
              Hear the Lore! (Audio Chapter)
            </p>
            <audio controls className="w-full rounded-md shadow-inner bg-black/30 p-2 focus:outline-none focus:ring-2 focus:ring-accent">
              <source src="https://raw.githubusercontent.com/Realized-Automaton/ABC-DE-FI/main/public/tpp.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
