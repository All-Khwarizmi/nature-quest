import { ClassificationAgent } from './agent';
import { ClassificationResult } from './types';
export type { ClassificationAgentInterface } from './types';

// Export singleton instance
export const classificationAgent = new ClassificationAgent();

// Export clean interface
export async function classifyImage(image: HTMLImageElement, file: File): Promise<ClassificationResult> {
  return classificationAgent.classifyImage(image, file);
}
