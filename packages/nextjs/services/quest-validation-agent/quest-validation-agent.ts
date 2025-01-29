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
        Only return ONE best matching quest or none if no good matches exist.`,
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              submission,
              availableQuests: availableQuests.filter(
                q => userQuests.pending.includes(q.id) && !userQuests.completed.includes(q.id),
              ),
            }),
          },
        ],
      });

      // Parse the structured response

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
