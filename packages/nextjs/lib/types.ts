export interface Species {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
}

export interface SpeciesDetailType extends Species {
  habitat: string;
  diet: string;
  length: string;
  wingspan: string;
  weight: string;
  lifespan: string;
  conservationStatus: string;
  achievements: Achievement[];
  relatedSpecies: RelatedSpeciesType[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
  transactionHash?: string;
  contractAddress?: string;
}

export interface RelatedSpeciesType {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  slug: string;
}
