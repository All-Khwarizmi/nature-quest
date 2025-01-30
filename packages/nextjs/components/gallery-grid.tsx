import Image from "next/image";
import Link from "next/link";
import { PlantClassification } from "~~/app/api/quest/classification-agent";
import { Upload } from "~~/src/db/schema";

interface GalleryGridProps {
  uploads: Upload[];
}

export function GalleryGrid({ uploads }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {uploads.map(upload => {
        const metadata = upload.metadata as PlantClassification;
        return (
          <Link
            key={upload.id}
            href={`/details/${upload.id}`}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
          >
            <Image
              src={upload.imageUrl || "/placeholder.svg"}
              alt={`Upload ${upload.id}`}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="text-lg font-bold leading-tight">{metadata.species}</h3>

              <p className="text-sm text-[#90EE90]">{new Date(upload.createdAt as Date).toLocaleDateString()}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
