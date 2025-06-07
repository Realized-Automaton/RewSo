import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About | Rewind Society',
  description: 'Learn about Rewind Society and its mission to celebrate the 80s.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary">About Rewind Society</h1>

      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">What is this Awesome Place?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg text-foreground">
          <p>
            Welcome, retro enthusiast, to Rewind Society! This is your digital time machine, a pixelated love letter to the raddest decade ever – the 1980s! 
            We're all about cassette tapes, high scores, neon lights, and that unmistakable 80s flair.
          </p>
          <div className="my-6 flex justify-center">
            <Image 
              src="https://placehold.co/500x300.png" 
              alt="80s montage with geometric shapes and neon" 
              width={500} 
              height={300} 
              className="rounded-lg shadow-xl border-4 border-accent"
              data-ai-hint="80s abstract neon"
            />
          </div>
          <p>
            Our totally tubular mission is to:
          </p>
          <ul className="list-disc list-inside pl-6 space-y-2">
            <li>Celebrate the vibrant culture, iconic styles, and unforgettable music of the 1980s.</li>
            <li>Provide an online arcade to relive classic 8-bit gaming glories.</li>
            <li>Let you generate your own gnarly, 80s-themed parody stickers.</li>
            <li>Showcase a righteous collection of digital cards inspired by 80s pop culture.</li>
            <li>Use cutting-edge AI to explore fun, retro-themed generated content and maybe even some absurd theories (because why not?).</li>
          </ul>
          <p>
            This site is built with Next.js, Tailwind CSS, ShadCN UI components, and powered by Genkit AI for the generative features.
            It's all about good times, a bit of a laugh, and a whole lot of nostalgia.
          </p>
          <p>
            So, crank up the synthwave, tease your hair, and dive in! Just remember to have fun – it's the 80s way!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
