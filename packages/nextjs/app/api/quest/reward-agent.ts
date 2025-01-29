import { CoreTool, LanguageModelV1, generateObject, generateText } from "ai";
import { z } from "zod";

type Tools = { [key: string]: CoreTool };

/**
 * Structured Response
 * @description This interface defines a structured response object
 * @property result - A boolean indicating whether the transaction was successful
 * @property transactionHash - The transaction hash of the transaction
 */
type StructuredResponse = { result: boolean; transactionHash: string };

const Schema = z.object({
  result: z.boolean().describe("true if the transaction was successful, false otherwise"),
  transactionHash: z.string().describe("The transaction hash of the transaction"),
});
export class RewardAgent {
  private readonly _model: LanguageModelV1;
  private readonly _tools: Tools;
  constructor(tools: Tools, model: LanguageModelV1) {
    this._model = model;
    this._tools = tools;
  }

  static generateRewardPrompt(userAddress: string, tokenSymbol: string, amount: number): string {
    const templatePrompt = `Transfer ${amount} of ${tokenSymbol} to ${userAddress}`;
    return templatePrompt;
  }

  static generateRewardResponsePrompt(tx: string): string {
    const templatePrompt = `Given the result of the transaction, generate a structured response. If the transaction was successful, return true and the transaction hash. Otherwise, return false and an error message.
    
    Transaction result: ${tx}
    `;
    return templatePrompt;
  }

  /**  **Reward Agent**
   * @description This agent will reward the user with the specified amount of tokens
   *  The agent will use the specified tools to interact with the blockchain
   *  The agent will use the specified model to generate text
   *
   *  @argument prompt - The prompt to use for the agent
   *  @argument maxSteps - The maximum number of steps to take
   *  @argument cb - A callback function to be called after each step
   *  @returns `string` The result of the reward operation call as a string
   */
  async rewardUser(prompt: string, maxSteps = 10, cb?: (...args: unknown[]) => void) {
    let receipt = "";
    try {
      const operation = await generateText({
        model: this._model,
        tools: this._tools,
        maxSteps,
        prompt,
        onStepFinish: event => {
          // TODO: Handle the tool results and call next steps
          console.log(event.toolResults);
          cb?.();
        },
      });

      receipt = operation.text;
      console.log(receipt);
      return receipt;
    } catch (error) {
      console.error(error);
      receipt = "Error rewarding user";
      return receipt;
    }
  }

  /**
   * Generate a structured response from the reward agent
   * @description This function generates a structured response from the reward agent
   *  It takes a prompt and generates a structured response based on the result of the reward operation
   * @param prompt - The prompt to use for the reward agent
   * @returns `StructuredResponse` The structured response object
   */
  async generateStructuredResponse(prompt: string): Promise<StructuredResponse> {
    let response: StructuredResponse = {
      result: false,
      transactionHash: "",
    };
    try {
      const operation = await generateObject({
        model: this._model,
        schema: Schema,
        prompt,
      });

      response = operation.object;
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      response = {
        result: false,
        transactionHash: "",
      };
      return response;
    }
  }
}

const PlantClassificationSchema = z.object({
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
