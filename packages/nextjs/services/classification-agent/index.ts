import { ClassificationAgent } from "./agent";
import { ClassificationResult } from "./types";

export type { ClassificationAgentInterface } from "./types";

// Export singleton instance
export const classificationAgent = new ClassificationAgent();

// Export clean interface
export async function classifyImage(image: HTMLImageElement, file: File): Promise<ClassificationResult> {
  console.log(image, file, "inside classify image");
  return classificationAgent.classifyImage(image, file);
}
