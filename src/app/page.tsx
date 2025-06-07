
import type { Metadata } from 'next';
import Link from 'next/link';
import { Gamepad2, Layers, SquareStack, MessageSquareText, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Home | Rewind Society',
  description: 'Welcome to Rewind Society! Explore the arcade, stickers, cards, and more 80s fun.',
};

const sections = [
  { href: '/arcade', title: 'Arcade', description: 'Play retro 8-bit games!', icon: Gamepad2, dataAiHint: "arcade game" },
  { href: '/stickers', title: 'Sticker Generator', description: 'Create your own 80s parody stickers.', icon: Layers, dataAiHint: "sticker collection" },
  { href: '/cards', title: 'Card Collection', description: 'Browse nostalgic digital cards.', icon: SquareStack, dataAiHint: "trading cards" },
  { href: '/lore', title: 'White Poop Lore', description: 'Uncover absurd theories.', icon: MessageSquareText, dataAiHint: "mystery book" },
  { href: '/about', title: 'About Us', description: 'Learn more about this radical place.', icon: Info, dataAiHint: "information sign" },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('https://i.ibb.co/zWhHVsRX/artwork-2025-06-03-T092428-574.png')" }}
    >
      <div
        className="flex flex-col items-center justify-center p-4 bg-black/70 min-h-screen w-full"
      >
        <div className="text-center mb-12 px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-primary animate-pulse">Welcome to Rewind Society!</h2>
          <p className="text-xl md:text-2xl text-slate-200">
            Your portal to the raddest hits of the 80s! Games, art, and pure nostalgic vibes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
          {sections.map((section) => (
            <Link href={section.href} key={section.title} passHref>
              <Card className="neon-border hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer h-full flex flex-col bg-card/30 backdrop-blur-sm">
                <CardHeader className="flex-row items-center space-x-4">
                  <section.icon className="h-10 w-10 text-accent" />
                  <div>
                    <CardTitle className="text-2xl font-bold text-primary">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-lg text-card-foreground">{section.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
