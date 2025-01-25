import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { RelatedSpeciesType } from "~~/lib/types";

interface RelatedSpeciesProps {
  species: RelatedSpeciesType[];
}

export function RelatedSpecies({ species }: RelatedSpeciesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {species.map(relatedSpecies => (
        <Link key={relatedSpecies.id} href={`/species/${relatedSpecies.id}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                <Image
                  src={relatedSpecies.image || "/placeholder.svg"}
                  alt={relatedSpecies.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-[#2C5530] line-clamp-1">{relatedSpecies.name}</h3>
              <p className="text-sm text-[#90EE90] line-clamp-1">{relatedSpecies.scientificName}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
