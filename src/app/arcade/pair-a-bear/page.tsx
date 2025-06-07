
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const CARD_BACK_URL = "https://i.ibb.co/mCvy7MMH/bears-full-colour-with-monkey.png";

const BEAR_IMAGES_DATA = [
  { url: "https://i.ibb.co/kVHcdVPb/RH-NFT.png", pairId: "rh-nft-pack", hint: "RH NFT pack" },
  { url: "https://i.ibb.co/spcMcXw7/bitcoin-bear-with-monkey.png", pairId: "bitcoin-bear", hint: "bitcoin bear" },
  { url: "https://i.ibb.co/wNZJYkYp/bnb-chain.png", pairId: "bnb-bear", hint: "bnb crypto bear" },
  { url: "https://i.ibb.co/KcM1H9WC/eth-chain.png", pairId: "eth-bear", hint: "ethereum crypto bear" },
  { url: "https://i.ibb.co/N6mgL6fF/pulse-chain.png", pairId: "pulse-bear", hint: "pulse crypto bear" },
];

interface GameCard {
  id: string;
  pairId: string;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
  dataAiHint: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function PairBearsPage() {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<GameCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState<'initial' | 'playing' | 'won'>('initial');
  const [isChecking, setIsChecking] = useState(false);

  const initializeGame = useCallback(() => {
    const gameCardsSource = BEAR_IMAGES_DATA.flatMap((imgData) => [
      { ...imgData, uniqueIdSuffix: '-a' },
      { ...imgData, uniqueIdSuffix: '-b' },
      { ...imgData, uniqueIdSuffix: '-c' },
      { ...imgData, uniqueIdSuffix: '-d' },
    ]);

    const newCards = gameCardsSource.map((imgData) => ({
      id: `${imgData.pairId}${imgData.uniqueIdSuffix}`,
      pairId: imgData.pairId,
      imageUrl: imgData.url,
      isFlipped: false,
      isMatched: false,
      dataAiHint: imgData.hint,
    }));

    setCards(shuffleArray(newCards));
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStatus('playing');
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (gameStatus === 'initial') {
        // Game can be started by button
    }
  }, [gameStatus, initializeGame]);

  const handleCardClick = (clickedCard: GameCard) => {
    if (gameStatus !== 'playing' || isChecking || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards(prev => [...prev, newCards.find(c => c.id === clickedCard.id)!]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves(prevMoves => prevMoves + 1);
      const [firstCard, secondCard] = flippedCards;

      if (firstCard.pairId === secondCard.pairId) {
        // Match
        setCards(prevCards =>
          prevCards.map(card =>
            (card.id === firstCard.id || card.id === secondCard.id) 
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards]);

  useEffect(() => {
    if (BEAR_IMAGES_DATA.length > 0 && matchedPairs === (BEAR_IMAGES_DATA.length * 2) && gameStatus === 'playing') {
      setGameStatus('won');
    }
  }, [matchedPairs, gameStatus]);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-center mb-6">
        <Image
          src="https://i.ibb.co/Q3rdTLGg/match-the-bears.png"
          alt="Match the Bears title"
          width={300}
          height={25}
          className="object-contain"
          unoptimized={true}
          data-ai-hint="Match Bears title"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      <Card className="neon-border">
        <CardHeader className="text-center">
          <CardDescription className="font-pixel text-lg text-muted-foreground mt-2">
            Find all the pairs to win. Good luck!
          </CardDescription>
          {gameStatus !== 'initial' && (
            <p className="font-pixel text-2xl text-primary">Moves: {moves}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          {gameStatus === 'initial' && (
            <>
              <Image
                src="https://i.ibb.co/mCvy7MMH/bears-full-colour-with-monkey.png"
                alt="Pair Bears Game Preview - A group of colorful cartoon bears"
                width={400}
                height={300}
                className="mx-auto mb-6 rounded-lg border-2 border-primary shadow-md object-cover"
                data-ai-hint="colorful bears group"
                unoptimized={true}
                onContextMenu={(e) => e.preventDefault()}
              />
              <Button onClick={initializeGame} variant="outline" className="font-pixel border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg">
                <RotateCcw className="mr-2 h-5 w-5" /> Start Game
              </Button>
            </>
          )}

          {(gameStatus === 'playing' || gameStatus === 'won') && (
            <div className="grid grid-cols-5 gap-4 md:gap-6 max-w-3xl w-full">
              {cards.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={isChecking || card.isFlipped || card.isMatched}
                  className="aspect-[3/4] rounded-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent disabled:transform-none"
                  aria-label={`Card ${card.isFlipped || card.isMatched ? card.pairId : 'back'}`}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="relative w-full h-full">
                    {(card.isFlipped || card.isMatched) ? (
                      <Image
                        src={card.imageUrl}
                        alt={card.pairId}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 640px) 216px, (max-width: 768px) 180px, (max-width: 1024px) 162px, 144px"
                        className="rounded-md border-2 border-primary"
                        data-ai-hint={card.dataAiHint}
                        unoptimized={true}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <Image
                        src={CARD_BACK_URL}
                        alt="Card Back"
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 640px) 216px, (max-width: 768px) 180px, (max-width: 1024px) 162px, 144px"
                        className="rounded-md border-2 border-secondary"
                        data-ai-hint="colorful bears" 
                        unoptimized={true}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {gameStatus === 'won' && (
            <div className="text-center space-y-4 p-6 bg-background/50 rounded-lg shadow-xl mt-6">
              <h2 className="text-4xl font-pixel text-accent">YOU WIN!</h2>
              <p className="text-xl text-foreground">You matched all the bears in {moves} moves!</p>
              <Button onClick={initializeGame} variant="default" className="font-pixel px-8 py-4 text-xl">
                <RotateCcw className="mr-2 h-6 w-6" /> Play Again
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/arcade" passHref>
              <Button variant="outline" className="font-pixel border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Arcade Zone
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
