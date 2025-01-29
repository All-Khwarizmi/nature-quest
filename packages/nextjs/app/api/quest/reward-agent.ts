import { CoreTool, LanguageModelV1, generateObject, generateText } from "ai";
import { z } from "zod";

type Tools = { [key: string]: CoreTool };
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
