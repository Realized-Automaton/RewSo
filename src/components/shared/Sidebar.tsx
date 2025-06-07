
// src/components/shared/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Layers, SquareStack, MessageSquareText, Info, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { href: '/stickers', label: 'Stickers', icon: Layers },
  { href: '/cards', label: 'Cards', icon: SquareStack },
  { href: '/lore', label: 'Lore', icon: MessageSquareText },
  { href: '/about', label: 'About', icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground px-0 py-4 space-y-6 border-r border-sidebar-border flex flex-col">
      <div className="text-center py-2">
        <Link href="/" className="inline-block">
          {/* Explicit width for the container, calculated from sidebar width and padding */}
          <div className="relative w-[240px] h-[60px] mx-auto">
            <Image
              src="https://i.ibb.co/WWdHPFfZ/a-logo-for-a-website-that-is-black-hot-pink-neon.png"
              alt="Rewind Society Logo"
              fill
              priority
              sizes="240px"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>
      </div>
      <nav className="flex-grow px-1"> {/* Add px-1 here for nav items if needed, or adjust li padding */}
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <a
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary-foreground" : "text-sidebar-primary group-hover:text-sidebar-accent-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="text-xs text-center text-muted-foreground pb-2 px-1"> {/* Add px-1 here for copyright */}
        &copy; {new Date().getFullYear()} Rewind Society
      </div>
    </aside>
  );
}
