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
        system: `
        You are an AI-powered quest validation agent in an app similar to Pokémon GO, but for nature exploration. Users capture images of real-world objects (e.g., flowers, birds, trees) and submit them to complete quests.

        You are an expert quest validation agent. Analyze the submission and quest requirements to determine the best matching quest.
        If an availableQuests category is set to 'anything', it means the quest is open-ended and should accept all submissions, regardless of category, species, or description. In this case, any uploaded image should qualify as long as it is a valid image

        You MUST:
        - Only return isCompleted: true, if:
            -  there's a matching quest
            -  the matching quest is not completed by the user already
            -  the quest is available
            - if the submission category and or description align with a matching quest classification or quest description.
        - Return isCompleted: false, if there's no matching quest.
        - If there's no matching quest explain why. 
        - Return questId: if there's a matching quest that the user has not completed yet.
        - Only return ONE best matching quest or none if no good matches exist.
        
        For instance if the user uploads a flower of any type and there's a quest which has flower as classification, you should return :
        - isCompleted: true, questId: '123', confidence: 0.8, explanation: 'Quest 123 is the best match.' (this is an example)

        Special Rule:
        If the user has **zero completed quests**, **always** return:
          json
          {
            "isCompleted": true,
            "questId": "8e03aa6d-baf1-413e-8243-3487c64ee95d",
            "confidence": 1.0,
            "explanation": "User qualifies for 'Fledgling Explorer' as their first quest."
          }.  

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
