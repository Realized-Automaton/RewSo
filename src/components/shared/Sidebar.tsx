// src/components/shared/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Layers, SquareStack, MessageSquareText, Info, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Sidebar as UISidebar,
  SidebarHeader as UISidebarHeader,
  SidebarContent as UISidebarContent,
  SidebarFooter as UISidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar, // Import useSidebar
} from '@/components/ui/sidebar'; 

const navItems = [
  { href: '/', label: 'Home', icon: Home, tooltip: 'Home' },
  { href: '/arcade', label: 'Arcade', icon: Gamepad2, tooltip: 'Arcade Zone' },
  { href: '/stickers', label: 'Stickers', icon: Layers, tooltip: 'Sticker Generator' },
  { href: '/cards', label: 'Cards', icon: SquareStack, tooltip: 'Card Collection' },
  { href: '/lore', label: 'Lore', icon: MessageSquareText, tooltip: 'White Poop Lore' },
  { href: '/about', label: 'About', icon: Info, tooltip: 'About Us' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar(); 

  return (
    <UISidebar collapsible="icon" side="left" variant="sidebar">
      <UISidebarHeader className="text-center py-2 px-2"> {/* Centering and padding directly on header */}
        <Link href="/" className="inline-block">
          {/* Logo for expanded state */}
          {sidebarState === 'expanded' && (
            <div className="relative w-full max-w-[200px] h-[50px] mx-auto">
              <Image
                src="https://i.ibb.co/WWdHPFfZ/a-logo-for-a-website-that-is-black-hot-pink-neon.png"
                alt="Rewind Society Logo"
                fill
                priority
                sizes="(max-width: 768px) 180px, 200px"
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
          {/* Icon/Favicon for collapsed state (desktop) */}
          {sidebarState === 'collapsed' && (
             <div className="relative w-8 h-8 mx-auto"> 
              <Image
                src="https://i.ibb.co/c8msxR9/favicon-32x32.png" 
                alt="Rewind Society Icon"
                fill
                priority
                sizes="32px"
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </Link>
      </UISidebarHeader>

      <UISidebarContent className="flex-grow p-1">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  href={item.href}
                  asChild
                  isActive={isActive}
                  className={cn(
                    "group transition-all", 
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
                  )}
                  tooltip={{ children: item.tooltip, side: 'right', align: 'center' }}
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0", 
                        isActive ? "text-primary-foreground" : "text-sidebar-primary group-hover:text-sidebar-accent-foreground"
                      )}
                    />
                    <span className={cn(sidebarState === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100 w-auto', 'transition-opacity duration-200 ease-in-out overflow-hidden whitespace-nowrap')}>
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </UISidebarContent>

      <UISidebarFooter className="p-1">
        <div className={cn(
          "text-xs text-center text-muted-foreground pb-2 transition-opacity duration-200 ease-in-out",
           sidebarState === 'collapsed' ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'
           )}>
          &copy; {new Date().getFullYear()} Rewind Society
        </div>
      </UISidebarFooter>
    </UISidebar>
  );
}
