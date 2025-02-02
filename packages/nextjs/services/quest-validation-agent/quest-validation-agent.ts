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
      // Add debug logging
      console.log("Validating submission:", {
        submission,
        userQuestsCompleted: userQuests.completed.length,
        availableQuestsCount: availableQuests.length,
      });

      const result = await generateObject({
        model: this._model,
        schema: QuestValidationResultSchema,
        system: `
        You are an AI-powered quest validation agent for a nature exploration app.

        FIRST AND MOST IMPORTANT RULE:
        Check if user has completed any quests:
        - If userQuests.completed array is empty (length = 0), this means it's their first submission
        - For first-time submissions, you MUST ALWAYS return:
        {
          "isCompleted": true,
          "questId": "8e03aa6d-baf1-413e-8243-3487c64ee95d", // First available quest
          "confidence": 1.0,
          "explanation": "First time submission automatically qualifies for the introductory quest."
        }
        
        Only if the user has previous completed quests, proceed with normal validation:
        - Check if submission matches any available quest classifications
        - Verify quest hasn't been completed
        - Return best matching quest or explain why no match

        You MUST match only quest per submission.

        Current Context:
        - User has completed ${userQuests.completed.length} quests
        - There are ${availableQuests.length} available quests
        - Submission category: ${submission.category}
        `,
        prompt: `Based on:
        - User completed quests: ${userQuests.completed.length}
        - Submission: ${JSON.stringify(submission)}
        - Available quests: ${JSON.stringify(availableQuests)}

        Determine if this qualifies for completion. Remember: If this is a first-time submission (0 completed quests), automatically approve it. Also remember only one quest per submission.`,
      });

      // Add validation logging
      console.log("Validation result:", result.object);

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
