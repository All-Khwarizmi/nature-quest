import Image from "next/image";
import Link from "next/link";

interface SpeciesCardProps {
  name: string;
  scientificName: string;
  image: string;
  slug: string;
}

export function SpeciesCard({ name, scientificName, image, slug }: SpeciesCardProps) {
  return (
    <Link href={`/species/${slug}`} className="group">
      <div className="rounded-2xl bg-[#F5F7F5] overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="aspect-square relative">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-[#2C5530]">{name}</h3>
          <p className="text-[#90EE90] text-sm">{scientificName}</p>
        </div>
      </div>
    </Link>
  );
}
