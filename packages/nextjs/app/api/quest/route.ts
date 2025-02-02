import { NextRequest } from "next/server";
import { PlantClassification, PlantClassificationSchema } from "./classification-agent";
import { AGENT_ADR, AGENT_PRIVATE_KEY, CONTRACT_ADDRESS } from "./constants";
import { RewardAgent } from "./reward-agent";
import { TOOLS } from "./tools";
import { openai } from "@ai-sdk/openai";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { QuestAgent } from "~~/services/quest-agent/agent";
import { QuestValidationAgent } from "~~/services/quest-validation-agent/quest-validation-agent";
import { TEMPORARY_User, getUserByAddress } from "~~/src/actions/userActions";
import { db } from "~~/src/db/drizzle";
import { uploads } from "~~/src/db/schema";

const RequestSchema = z.object({
  userAddress: z.string(),
  classificationJson: PlantClassificationSchema,
  uploadId: z.string(),
});
// Quest Check Module// api/quest/route.ts
export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const isRequestValid = RequestSchema.safeParse(requestBody);

    if (!isRequestValid.success) {
      return Response.json({ error: isRequestValid.error.message }, { status: 400 });
    }

    const { userAddress, classificationJson, uploadId } = isRequestValid.data;

    await processQuestInBackground(userAddress, classificationJson, uploadId);

    return Response.json({
      status: "Processed",
      uploadId,
      message: "Your submission has been processed",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

async function processQuestInBackground(
  userAddress: string,
  classificationJson: PlantClassification,
  uploadId: string,
) {
  try {
    const MODEL = openai("gpt-4o");
    const validationAgent = new QuestValidationAgent(MODEL);
    const questAgent = new QuestAgent(db, validationAgent);
    const user = (await getUserByAddress(userAddress)) as TEMPORARY_User;

    const completedQuest = await questAgent.checkIfQuestsAreCompleted(classificationJson, user);

    if (completedQuest) {
      if (!AGENT_PRIVATE_KEY || !AGENT_ADR || !CONTRACT_ADDRESS) {
        throw new Error("Missing environment variables");
      }

      const rewardAgent = new RewardAgent(TOOLS, MODEL);
      const AMOUNT = questAgent.getRewardAmount();
      const templatePrompt = RewardAgent.generateRewardPrompt(userAddress, AMOUNT);

      const promises = [rewardAgent.rewardUser(templatePrompt), questAgent.markQuestAsCompleted(user, uploadId)];

      const [tx] = await Promise.allSettled(promises);

      if (!tx) {
        throw new Error("Failed to reward user");
      }
    } else {
      await db.update(uploads).set({ status: "rejected" }).where(eq(uploads.id, uploadId));
    }
  } catch (error) {
    console.error("Background processing error:", error);
    // Update upload status to error
    await db.update(uploads).set({ status: "error" }).where(eq(uploads.id, uploadId));
  }
}
