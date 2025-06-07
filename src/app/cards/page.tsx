import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Card Collection | Rewind Society',
  description: 'Browse the nostalgic collection of Rewind Society digital cards.',
};

interface DigitalCard {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  stats: { label: string; value: string | number }[];
  series: '80s Icons' | 'Retro Parody'; 
  dataAiHint: string;
}

const cardData: DigitalCard[] = [
  {
    id: 'bpk1',
    name: 'Max Headroom Glitch', 
    imageUrl: 'https://placehold.co/300x400.png',
    description: "He's c-c-c-coming at ya with digital stutters and a whole lotta attitude.",
    stats: [
      { label: 'Broadcast Power', value: '88 MHz' },
      { label: 'Glitches/Min', value: '23' },
      { label: 'Cool Factor', value: 'Max' },
    ],
    series: '80s Icons',
    dataAiHint: '80s tv glitch',
  },
  {
    id: 'bpk2',
    name: 'Synthwave Surfer',
    imageUrl: 'https://placehold.co/300x400.png',
    description: "Riding the digital waves on a neon surfboard, powered by pure synth.",
    stats: [
      { label: 'Speed', value: 'Light' },
      { label: 'Hair Volume', value: 'Extreme' },
      { label: 'Soundtrack', value: 'Epic' },
    ],
    series: 'Retro Parody',
    dataAiHint: 'neon surfer',
  },
  {
    id: 'tt1',
    name: 'Boombox Blaster',
    imageUrl: 'https://placehold.co/300x400.png',
    description: "Always ready with the freshest beats and enough D batteries to power a small city.",
    stats: [
      { label: 'Volume', value: '11/10' },
      { label: 'Bass Drop', value: 'Seismic' },
      { label: 'Street Cred', value: '100%' },
    ],
    series: '80s Icons',
    dataAiHint: 'retro boombox',
  },
  {
    id: 'tt2',
    name: 'Arcade Ace',
    imageUrl: 'https://placehold.co/300x400.png',
    description: "Lives for the high score, fueled by quarters and sugary snacks. Knows all the cheat codes.",
    stats: [
      { label: 'Joystick Skills', value: 'Master' },
      { label: 'Tokens Spent', value: 'Countless' },
      { label: 'Victory Dance', value: 'Legendary' },
    ],
    series: 'Retro Parody',
    dataAiHint: 'arcade champion',
  },
   {
    id: 'bpk3',
    name: 'Mallrat Maverick',
    imageUrl: 'https://placehold.co/300x400.png',
    description: "Expert in food court loitering and fountain coin wishing. Knows every store, every sale.",
    stats: [
      { label: 'Shopping Bags', value: 'Many' },
      { label: 'Hair Spray Used', value: 'A Lot' },
      { label: 'Hangout Level', value: 'Professional' },
    ],
    series: '80s Icons',
    dataAiHint: '80s mall fashion',
  },
  {
    id: 'tt3',
    name: 'Cassette Knight',
    imageUrl: 'https://placehold.co/300x400.png',
    description: "Guardian of mixtapes, wielder of the mighty #2 pencil for tape emergencies.",
    stats: [
      { label: 'Rewind Speed', value: '0.5x' },
      { label: 'Tape Untangling', value: 'Expert' },
      { label: 'Playlist Curation', value: 'Artform' },
    ],
    series: 'Retro Parody',
    dataAiHint: 'cassette tape',
  },
];

export default function CardsPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary">Digital Card Collection</h1>
      <p className="text-center text-xl text-muted-foreground">
        Check out this totally awesome gallery of 80s-themed digital collectibles!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card) => (
          <Card key={card.id} className="neon-border flex flex-col overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="p-0">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-md"
                  data-ai-hint={card.dataAiHint}
                />
              </div>
              <div className="p-4">
                <CardTitle className="text-2xl text-primary">{card.name}</CardTitle>
                <Badge variant={card.series === '80s Icons' ? "destructive" : "secondary"} className="mt-1">
                  {card.series}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-2">
              <CardDescription className="text-sm text-foreground">{card.description}</CardDescription>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Stats:</h4>
                <ul className="list-disc list-inside pl-2 text-xs text-foreground">
                  {card.stats.map((stat) => (
                    <li key={stat.label}>
                      <span className="font-semibold">{stat.label}:</span> {stat.value}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <p className="text-xs text-muted-foreground">Card ID: {card.id}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
