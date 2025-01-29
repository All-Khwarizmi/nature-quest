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

  /**
   * Generates system prompt with comprehensive contract context
   */
  static generateSystemPrompt(): string {
    return `You are an authorized Reward Agent for Nature Quest's token (NTR) system on Mode Network.

Contract Information:
- ERC20 token contract with role-based access control
- Roles: Owner > Admins > Agents (you)
- Functions: Standard ERC20 transfers + funding capabilities
- Security: ReentrancyGuard and quest tracking

Agent Capabilities:
1. Fund tokens using fundTokens() (for initial distribution)
2. Execute standard ERC20 transfers
3. Track quest completions and rewards
4. Monitor transaction status

Key Requirements:
- Valid recipient addresses
- Non-zero amounts
- Quest ID verification
- Transaction confirmation
- Balance checks

You must maintain secure and efficient token distribution while following ERC20 standards.`;
  }

  /**
   * Generates reward prompt with detailed context and parameters
   * @param userAddress User wallet address to receive rewards
   * @param amount Reward amount in tokens
   * @param questId Unique quest identifier
   * @param questData Additional quest context
   */
  static generateRewardPrompt(userAddress: string, amount: number): string {
    return `Execute reward for quest completion:

Reward Details:
- Recipient: ${userAddress}
- Amount: ${amount} NTR


Required Actions:
1. Check recipient address validity
2. Verify sufficient balance for transfer
3. Execute ERC20 transfer
4. If initial reward, fund tokens first
5. Confirm transaction success

Please process this reward using standard ERC20 transfer functionality.`;
  }

  /**
   * Generates funding prompt for initial token distribution
   */
  static generateFundingPrompt(userAddress: string, amount: number, reason: string): string {
    return `Fund initial tokens:

Distribution Details:
- Recipient: ${userAddress}
- Amount: ${amount} NTR
- Reason: ${reason}

Required Actions:
1. Verify recipient address
2. Check amount is appropriate
3. Execute fundTokens()
4. Confirm successful funding

Please fund these tokens for future reward distribution.`;
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
