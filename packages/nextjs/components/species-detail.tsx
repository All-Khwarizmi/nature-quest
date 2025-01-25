import Image from "next/image";
import { AchievementBadge } from "./achievement-badge";
import { RelatedSpecies } from "./related-species";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { SpeciesDetailType } from "~~/lib/types";

interface SpeciesDetailProps {
  species: SpeciesDetailType;
}

export function SpeciesDetail({ species }: SpeciesDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
        <Image src={species.image || "/placeholder.svg"} alt={species.name} fill className="object-cover" priority />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-[#2C5530] mb-2">{species.name}</h1>
          <p className="text-[#90EE90] text-lg mb-4">{species.scientificName}</p>

          <Tabs defaultValue="about" className="w-full">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="habitat">Habitat</TabsTrigger>
              <TabsTrigger value="diet">Diet</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="text-gray-700 leading-relaxed">
              {species.description}
            </TabsContent>
            <TabsContent value="habitat" className="text-gray-700 leading-relaxed">
              {species.habitat}
            </TabsContent>
            <TabsContent value="diet" className="text-gray-700 leading-relaxed">
              {species.diet}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-2 text-[#2C5530]">Quick Facts</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Length:</span>
                  <span className="font-medium">{species.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Wingspan:</span>
                  <span className="font-medium">{species.wingspan}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{species.weight}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Lifespan:</span>
                  <span className="font-medium">{species.lifespan}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-semibold text-lg mb-2 text-[#2C5530]">Conservation Status</h2>
            <Badge variant="outline" className="text-sm">
              {species.conservationStatus}
            </Badge>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2 text-[#2C5530]">Achievements</h2>
            <div className="grid grid-cols-3 gap-2">
              {species.achievements.map(achievement => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#2C5530] mb-4">Related Species</h2>
        <RelatedSpecies species={species.relatedSpecies} />
      </div>
    </div>
  );
}
