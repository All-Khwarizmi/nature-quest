import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Award, Camera, GalleryHorizontal, Github, Heart, MessageCircle } from "lucide-react";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              <Button variant="ghost" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                <span>Capture</span>
              </Button>
            </Link>
            <Link href="/gallery" className="text-foreground hover:text-primary transition-colors">
              <Button variant="ghost" size="sm" className="gap-2">
                <GalleryHorizontal className="h-4 w-4" />
                <span>Gallery</span>
              </Button>
            </Link>
            <Link href="/rewards" className="text-foreground hover:text-primary transition-colors">
              <Button variant="ghost" size="sm" className="gap-2">
                <Award className="h-4 w-4" />
                <span>Rewards</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-accent" />
            <span>for nature enthusiasts</span>
          </div>
          <div className="hidden md:block">·</div>
          <a
            href="https://github.com/yourusername/nature-quest"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <div className="hidden md:block">·</div>
          <a
            href="https://discord.gg/nature-quest"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Join our community</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
