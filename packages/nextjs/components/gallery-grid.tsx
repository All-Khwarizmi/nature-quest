import Image from "next/image";
import Link from "next/link";
import { Species } from "~~/lib/types";

interface GalleryGridProps {
  species: Species[];
}

export function GalleryGrid({ species }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {species.map(species => (
        <Link
          key={species.id}
          href={`/species/${species.id}`}
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
        >
          <Image
            src={species.image || "/placeholder.svg"}
            alt={species.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-lg font-bold leading-tight">{species.name}</h3>
            <p className="text-sm text-[#90EE90]">{species.scientificName}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
