
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Arcade | Rewind Society',
  description: 'Step into the 8-bit arcade at Rewind Society!',
};

const games = [
  { 
    href: "/arcade/pac-man", 
    src: "https://i.ibb.co/FvsM2t8/image.png", 
    alt: "Play Pac-Man Game", 
    hint: "Pac-Man arcade game", 
    label: "Play Pac-Man" 
  },
  { 
    href: "/arcade/galaga", 
    src: "https://i.ibb.co/Dg7nc7XK/enhanced-image-81.png", 
    alt: "Play Galaga Game", 
    hint: "Galaga space shooter", 
    label: "Play Galaga" 
  },
  { 
    href: "/arcade/pair-a-bear", 
    src: "https://i.ibb.co/mCvy7MMH/bears-full-colour-with-monkey.png", 
    alt: "Play Pair Bears Game", 
    hint: "bear matching game", 
    label: "Play Pair Bears" 
  },
];

export default function ArcadePage() {
  return (
    <div
      className="flex-1 flex flex-col bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('https://wallpapers.com/images/hd/80s-retro-background-2du295bnfqlh10bw.jpg')" }}
    >
      <div className="flex-grow flex flex-col w-full items-center justify-center py-8 md:py-12 bg-black/70">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-4xl sm:text-5xl font-pixel text-center text-primary [text-shadow:0_0_3px_hsl(var(--primary)),0_0_6px_hsl(var(--accent)/0.8),0_0_10px_hsl(var(--accent)/0.6),0_0_15px_hsl(var(--accent)/0.4)]">
            ARCADE ZONE
          </h1>
        </div>
        
        <Card className="neon-border max-w-3xl w-full mx-4 bg-card/30 backdrop-blur-sm">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="font-pixel text-2xl sm:text-3xl text-primary text-center">GET READY PLAYER ONE!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <p className="font-pixel text-base sm:text-lg text-foreground text-center">
              Our technicians are hard at work polishing the joysticks and vacuuming the pixel dust.
              Choose your challenge:
            </p>
            <ul className="list-disc list-inside font-pixel text-sm sm:text-md text-foreground space-y-2 pl-4 text-center md:text-left">
              <li>
                <Link href="/arcade/pac-man" className="text-accent hover:text-accent/80 hover:underline">
                  PAC-MAN: PELLET POWER!
                </Link>
                {' '} (Classic maze muncher!)
              </li>
              <li>
                <Link href="/arcade/galaga" className="text-accent hover:text-accent/80 hover:underline">
                  GALAGA: ALIEN INVASION
                </Link>
                {' '} (Classic Space Shooter - Concept)
              </li>
              <li>
                <Link href="/arcade/pair-a-bear" className="text-accent hover:text-accent/80 hover:underline">
                  PAIR BEARS
                </Link>
                {' '} (Memory Matching Mayhem!)
              </li>
            </ul>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-6 md:my-8 justify-items-center">
              {games.map(game => (
                <Link href={game.href} key={game.href} passHref className="group cursor-pointer w-full">
                  <div className="w-full rounded-lg overflow-hidden border-2 border-accent group-hover:border-primary transition-colors duration-200">
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={game.src}
                        alt={game.alt}
                        fill
                        className="object-cover"
                        data-ai-hint={game.hint}
                        sizes="(max-width: 767px) 80vw, (max-width: 1023px) 30vw, 250px"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <p className="font-pixel text-base sm:text-lg text-foreground text-center">
              Check back soon for more radical retro gaming action!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
