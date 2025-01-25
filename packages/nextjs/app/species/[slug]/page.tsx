import { SpeciesDetail } from "~~/components/species-detail";
import { getSpeciesDetail } from "~~/lib/data";

export default async function SpeciesDetailPage({ params }: { params: { slug: string } }) {
  const species = await getSpeciesDetail(params.slug);

  if (!species) {
    return <div>Species not found</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container px-4 py-8 pt-24">
        <SpeciesDetail species={species} />
      </div>
    </main>
  );
}
