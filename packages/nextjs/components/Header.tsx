"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Award, Bell, Camera, GalleryHorizontal, Search } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon: React.ReactElement;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Capture",
    href: "/",
    icon: <Camera className="h-4 w-4" />,
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: <GalleryHorizontal className="h-4 w-4" />,
  },
  {
    label: "Rewards",
    href: "/rewards",
    icon: <Award className="h-4 w-4" />,
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <Bars3Icon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-primary text-primary-content" : "text-foreground"
              } hover:bg-primary hover:text-primary-content transition-colors py-2 px-3 text-sm rounded-md flex items-center gap-2`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky top-0 z-50 bg-background backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" passHref className="flex items-center gap-2 mr-6">
              <Camera className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-primary">Nature&apos;s Quest</span>
            </Link>
            <ul className="hidden lg:flex space-x-4">
              <HeaderMenuLinks />
            </ul>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>NQ</AvatarFallback>
            </Avatar>
            <RainbowKitCustomConnectButton />
            <FaucetButton />
          </div>
          <div className="lg:hidden" ref={burgerMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(prevState => !prevState)}
              className="text-foreground hover:text-primary"
            >
              <Bars3Icon className="h-6 w-6" />
            </Button>
            {isDrawerOpen && (
              <ul
                className="absolute top-full right-0 mt-2 p-2 bg-background rounded-md shadow-lg"
                onClick={() => setIsDrawerOpen(false)}
              >
                <HeaderMenuLinks />
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
