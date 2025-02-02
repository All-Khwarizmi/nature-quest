import { Quest } from "../quest-agent/types";
import { LanguageModelV1, generateObject } from "ai";
import { z } from "zod";
import { PlantClassification } from "~~/app/api/quest/classification-agent";

const QuestValidationResultSchema = z.object({
  isCompleted: z.boolean(),
  questId: z.string(),
  confidence: z.number(),
  explanation: z.string(),
});

type QuestValidationResult = z.infer<typeof QuestValidationResultSchema>;

export class QuestValidationAgent {
  private readonly _model: LanguageModelV1;
  constructor(model: LanguageModelV1) {
    this._model = model;
  }

  /**
   * Validates the submission against the available quests
   * @param submission - The submission to validate
   * @param userQuests - The user's quests
   * @param availableQuests - The available quests
   * @returns The validation result
   * @example
   * const result = await validationAgent.validateSubmission(submission, userQuests, availableQuests);
   * console.log(result);
   * // { isCompleted: true, questId: '123', confidence: 0.8, explanation: 'Quest 123 is the best match.' }
   */
  async validateSubmission(
    submission: PlantClassification,
    userQuests: { pending: string[]; completed: string[] },
    availableQuests: Quest[],
  ): Promise<QuestValidationResult> {
    try {
      const result = await generateObject({
        model: this._model,
        schema: QuestValidationResultSchema,
        system: `You are an expert quest validation agent. Analyze the submission and quest requirements to determine the best matching quest.
        You MUST:
        - Only return isCompleted: true, if:
            -  there's a matching quest
            -  the matching quest is not completed by the user already
            -  the quest is available
        - Return isCompleted: false, if there's no matching quest.
        - If there's no matching quest explain why. 
        - Return questId: if there's a matching quest that the user has not completed yet.
        - Only return ONE best matching quest or none if no good matches exist.
        
        For instance if the user uploads a flower of any type and there's a quest which has flower as classification, you should return :
        - isCompleted: true, questId: '123', confidence: 0.8, explanation: 'Quest 123 is the best match.' (this is an example)

        Here are the details of the user and quests:
        - Submission: ${JSON.stringify(submission)}
        - User Quests: ${JSON.stringify(userQuests)}
        - Available Quests: ${JSON.stringify(availableQuests)}
        `,
        prompt: `
        Here are the details of the submission:
        - Submission: ${JSON.stringify(submission)}
        `,
      });

      return result.object;
    } catch (error) {
      console.error("Quest validation failed:", error);
      return {
        isCompleted: false,
        questId: "",
        confidence: 0,
        explanation: "Validation failed",
      };
    }
  }
}
