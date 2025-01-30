export type ClassificationResult =
  | {
      className: string;
      image: HTMLImageElement;
      file: File;
    }
  | undefined;

export interface ClassificationAgentInterface {
  classifyImage(image: HTMLImageElement, file: File): Promise<ClassificationResult>;
}
