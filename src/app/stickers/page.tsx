import type { Metadata } from 'next';
import StickerForm from './StickerForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Sticker Generator | Rewind Society',
  description: 'Create your own 80s parody stickers at Rewind Society!',
};

export default function StickersPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-primary">80s Sticker Shock Lab</h1>
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Unleash Your Inner 80s Artist!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Got a totally tubular idea for an 80s-themed sticker? Type your prompt below and let the AI work its magic!
            Think neon, geometric patterns, movie parodies... you get the picture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StickerForm />
        </CardContent>
      </Card>
    </div>
  );
}
