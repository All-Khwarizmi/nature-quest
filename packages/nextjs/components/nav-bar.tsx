import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Award, Bell, Camera, GalleryHorizontal, Search } from "lucide-react";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#2C5530]/10">
      <div className="container flex items-center h-16 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Camera className="w-6 h-6 text-[#2C5530]" />
          <span className="font-bold text-xl text-[#2C5530]">Nature `&apos;`s Quest</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/" className="text-[#2C5530] hover:text-[#1A332D] flex items-center">
            <Camera className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Capture</span>
          </Link>
          <Link href="/gallery" className="text-[#2C5530] hover:text-[#1A332D] flex items-center">
            <GalleryHorizontal className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Gallery</span>
          </Link>
          <Link href="/rewards" className="text-[#2C5530] hover:text-[#1A332D] flex items-center">
            <Award className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Rewards</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-[#708090]">
            <Search className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-[#708090]">
            <Bell className="w-5 h-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>NQ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
