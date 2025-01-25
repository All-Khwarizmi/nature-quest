import { GalleryGrid } from "~~/components/gallery-grid";
import { getSpecies } from "~~/lib/data";

export default async function GalleryPage() {
  const species = await getSpecies();

  return (
    <main className="min-h-screen bg-white">
      <div className="container px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold text-[#2C5530] mb-6">Species Gallery</h1>
        <GalleryGrid species={species} />
      </div>
    </main>
  );
}
