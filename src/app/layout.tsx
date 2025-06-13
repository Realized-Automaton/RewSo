
import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from '@/components/shared/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rewind Society',
  description: 'An 80s themed digital playground with retro games, generative AI, and nostalgic collectibles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${geistMono.variable} antialiased h-full`}>
        <SidebarProvider defaultOpen={true}>
          {/* This div establishes the main layout using CSS Grid */}
          <div className="grid grid-cols-[auto_1fr] h-full w-full">
            <Sidebar />
            {/* This div is the content column, its width is managed by the grid's '1fr' */}
            <div className="flex flex-col h-full overflow-hidden"> {/* Removed flex-1, min-w-0, w-full. Added overflow-hidden for safety. */}
              <main className="flex-1 flex flex-col overflow-y-auto bg-background"> {/* overflow-y-auto for content scroll */}
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
