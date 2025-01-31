import { LanguageModelV1, generateObject, generateText } from "ai";
import { z } from "zod";

export const PlantClassificationSchema = z.object({
  category: z.string(),
  species: z.string().optional(),
  confidence: z.number(),
  description: z.string(),
  isNature: z.boolean(),
});

export type PlantClassification = z.infer<typeof PlantClassificationSchema>;

export class ClassificationAgent {
  private readonly _model: LanguageModelV1;

  constructor(model: LanguageModelV1) {
    this._model = model;
  }

  // Helper to convert File to base64
  private async fileToBase64(file: File): Promise<string> {
    const imageAsUint8Array = await file.arrayBuffer();
    return Buffer.from(imageAsUint8Array).toString("base64");
  }

  // System prompt generator
  static generateClassificationSystemPrompt(): string {
    return `You are a botanical expert AI trained to identify and classify plants with high accuracy.
Your task is to analyze images and provide detailed, structured information about plants.

Guidelines:
- Focus only on plants and natural elements
- Provide confidence scores based on image clarity and distinguishing features
- Include both common and scientific names when confident
- Note any distinctive features or patterns
- Be explicit about uncertainty when present
- Flag non-plant/nature images immediately

Categories to classify:
- FLOWER: Any flowering plants
- TREE: Trees, large woody plants
- MUSHROOM: Fungi and mushrooms
- FERN: All types of ferns
- OTHER_PLANT: Other plant types
- ANIMALS: Any animals
- NOT_NATURE: Non-nature images`;
  }

  // User prompt generator
  static generateClassificationPrompt(imageContext?: string): string {
    return `Please analyze this image and identify any plants or natural elements present.
${imageContext ? `Additional context: ${imageContext}` : ""}
Provide a detailed classification following the structured format.`;
  }

  // Main classification method with structured output
  async classifyImage(file: File): Promise<PlantClassification> {
    try {
      const base64Image = await this.fileToBase64(file);

      const operation = await generateObject({
        model: this._model,
        schema: PlantClassificationSchema,
        system: ClassificationAgent.generateClassificationSystemPrompt(),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: ClassificationAgent.generateClassificationPrompt(),
              },
              {
                type: "image",
                image: base64Image,
              },
            ],
          },
        ],
      });

      return operation.object;
    } catch (error) {
      console.error("Classification error:", error);
      return {
        category: "ERROR",
        confidence: 0,
        description: "Failed to classify image",
        isNature: false,
      };
    }
  }

  // Method for getting raw text description
  async getImageDescription(file: File): Promise<string> {
    try {
      const base64Image = await this.fileToBase64(file);

      const { text } = await generateText({
        model: this._model,
        system: `You are a botanical expert. Please describe any plants or natural elements in this image 
        in a clear, scientific manner. If no plants or natural elements are present, state that explicitly.`,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Describe what you see in this image." },
              {
                type: "image",
                image: base64Image,
              },
            ],
          },
        ],
      });

      return text;
    } catch (error) {
      console.error("Description error:", error);
      return "Failed to generate image description";
    }
  }
}
