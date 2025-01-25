import type { Species } from "./types";
import type { SpeciesDetailType } from "./types";
import type { Achievement } from "./types";

const speciesData: Species[] = [
  {
    id: "1",
    name: "American Robin",
    scientificName: "Turdus migratorius",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
    description: "A common North American bird with a red-orange breast and gray-brown upper parts.",
  },
  {
    id: "2",
    name: "Eastern Bluebird",
    scientificName: "Sialia sialis",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
    description: "A small thrush with a bright blue back and reddish-orange breast.",
  },
  {
    id: "3",
    name: "Mallard Duck",
    scientificName: "Anas platyrhynchos",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
    description: "A common and widespread dabbling duck with a distinctive green head on males.",
  },
  {
    id: "4",
    name: "Bald Eagle",
    scientificName: "Haliaeetus leucocephalus",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
    description: "A large bird of prey known for its white head and tail contrasting with its dark brown body.",
  },
  {
    id: "5",
    name: "Great Blue Heron",
    scientificName: "Ardea herodias",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
    description: "A large wading bird with a long neck and legs, often seen near water bodies.",
  },
  {
    id: "6",
    name: "Ruby-throated Hummingbird",
    scientificName: "Archilochus colubris",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
    description: "A tiny bird known for its ability to hover and fly backwards, with males having a bright red throat.",
  },
];

const speciesDetailData: Record<string, SpeciesDetailType> = {
  "american-robin": {
    id: "1",
    name: "American Robin",
    scientificName: "Turdus migratorius",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
    description:
      "The American Robin is a migratory songbird of the true thrush genus and Turdidae, the wider thrush family. It is widely distributed throughout North America, wintering from southern Canada to central Mexico and along the Pacific Coast.",
    habitat:
      "American Robins are common birds across the continent. You'll find them on lawns, fields, and city parks, as well as in more wild places like woodlands, forests, mountains up to near treeline, recently burned forests, and tundra.",
    diet: "American Robins eat a lot of invertebrates, such as earthworms, insects, and snails. They also eat fruits, including chokecherries, hawthorn, dogwood, and sumac fruits.",
    length: "23-28 cm (9-11 in)",
    wingspan: "31-40 cm (12-16 in)",
    weight: "77-85 g (2.7-3.0 oz)",
    lifespan: "2 years on average, up to 14 years",
    conservationStatus: "Least Concern",
    achievements: [
      { id: "1", name: "First Sighting", image: "/placeholder.svg", unlocked: true, description: "" },
      { id: "2", name: "Spring Singer", image: "/placeholder.svg", unlocked: false, description: "" },
      { id: "3", name: "Nest Finder", image: "/placeholder.svg", unlocked: false, description: "" },
    ],
    relatedSpecies: [
      {
        id: "2",
        name: "Eastern Bluebird",
        scientificName: "Sialia sialis",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
        slug: "eastern-bluebird",
      },
      {
        id: "3",
        name: "Wood Thrush",
        scientificName: "Hylocichla mustelina",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nature_s_Quest-QnXtCxY2JMQOKssgG52OqVnSNFtEFj.png",
        slug: "wood-thrush",
      },
    ],
  },
  // Add more species details here...
};

const userAchievements: Achievement[] = [
  {
    id: "1",
    name: "Early Bird",
    description: "Spot 10 different bird species before 8 AM",
    image: "/placeholder.svg",
    unlocked: true,
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    contractAddress: "0xabcdef1234567890abcdef1234567890abcdef1234",
  },
  {
    id: "2",
    name: "Nest Hunter",
    description: "Discover and photograph 5 different bird nests",
    image: "/placeholder.svg",
    unlocked: true,
    transactionHash: "0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1",
    contractAddress: "0xbcdef1234567890abcdef1234567890abcdef12345",
  },
  {
    id: "3",
    name: "Rare Sighting",
    description: "Spot and photograph a rare or endangered bird species",
    image: "/placeholder.svg",
    unlocked: false,
  },
  {
    id: "4",
    name: "Birdsong Maestro",
    description: "Correctly identify 20 different bird songs",
    image: "/placeholder.svg",
    unlocked: false,
  },
  {
    id: "5",
    name: "Migration Tracker",
    description: "Log sightings of 10 migratory bird species in a single season",
    image: "/placeholder.svg",
    unlocked: false,
  },
  // Add more achievements as needed
];

export async function getSpecies(): Promise<Species[]> {
  // In a real application, this would fetch data from an API or database
  return speciesData;
}

export async function getSpeciesDetail(slug: string): Promise<SpeciesDetailType | null> {
  // In a real application, this would fetch data from an API or database
  return speciesDetailData[slug] || null;
}

export async function getUserAchievements(): Promise<Achievement[]> {
  // In a real application, this would fetch data from an API or database
  return userAchievements;
}
