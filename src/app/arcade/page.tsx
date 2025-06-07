
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Arcade | Rewind Society',
  description: 'Step into the 8-bit arcade at Rewind Society!',
};

export default function ArcadePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('https://wallpapers.com/images/hd/80s-retro-background-2du295bnfqlh10bw.jpg')" }}
    >
      <div className="flex flex-col items-center justify-center py-12 bg-black/70 min-h-screen w-full">
        <div className="text-center mb-12 px-4">
          <h1 className="text-5xl font-pixel text-center text-primary [text-shadow:0_0_3px_hsl(var(--primary)),0_0_6px_hsl(var(--accent)/0.8),0_0_10px_hsl(var(--accent)/0.6),0_0_15px_hsl(var(--accent)/0.4)]">
            ARCADE ZONE
          </h1>
        </div>
        
        <Card className="neon-border max-w-3xl w-full bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-pixel text-3xl text-primary text-center">GET READY PLAYER ONE!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-pixel text-lg text-foreground text-center">
              Our technicians are hard at work polishing the joysticks and vacuuming the pixel dust.
              Choose your challenge:
            </p>
            <ul className="list-disc list-inside font-pixel text-md text-foreground space-y-2 pl-4 text-center md:text-left">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8 justify-items-center">
              <Link href="/arcade/pac-man" passHref>
                <div className="relative group cursor-pointer w-full max-w-[250px] h-[170px] sm:w-[300px] sm:h-[200px]">
                  <Image 
                    src="https://i.ibb.co/FvsM2t8/image.png" 
                    alt="Play Pac-Man Game" 
                    width={300} 
                    height={200} 
                    className="rounded-md border-2 border-accent object-cover group-hover:opacity-80 transition-opacity h-full w-full" 
                    data-ai-hint="Pac-Man game arcade" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-white font-pixel text-xl">Play Pac-Man</span>
                  </div>
                </div>
              </Link>
              <Link href="/arcade/galaga" passHref>
                <div className="relative group cursor-pointer w-full max-w-[250px] h-[170px] sm:w-[300px] sm:h-[200px]">
                  <Image 
                    src="https://i.ibb.co/Dg7nc7XK/enhanced-image-81.png" 
                    alt="Play Galaga Game" 
                    width={300} 
                    height={200} 
                    className="rounded-md border-2 border-accent object-cover group-hover:opacity-80 transition-opacity h-full w-full" 
                    data-ai-hint="Galaga space shooter" 
                  />
                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-white font-pixel text-xl">Play Galaga</span>
                  </div>
                </div>
              </Link>
              <Link href="/arcade/pair-a-bear" passHref>
                <div className="relative group cursor-pointer w-full max-w-[250px] h-[170px] sm:w-[300px] sm:h-[200px]">
                  <Image 
                    src="https://i.ibb.co/mCvy7MMH/bears-full-colour-with-monkey.png" 
                    alt="Play Pair Bears Game" 
                    width={300} 
                    height={200} 
                    className="rounded-md border-2 border-accent object-cover group-hover:opacity-80 transition-opacity h-full w-full" 
                    data-ai-hint="bear matching game"
                  />
                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <span className="text-white font-pixel text-xl">Play Pair Bears</span>
                  </div>
                </div>
              </Link>
            </div>
            <p className="font-pixel text-lg text-foreground text-center">
              Check back soon for more radical retro gaming action!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
