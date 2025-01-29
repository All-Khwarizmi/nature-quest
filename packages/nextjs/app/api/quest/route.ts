import { NextRequest } from "next/server";
import { AGENT_ADR, AGENT_PRIVATE_KEY, CONTRACT_ADDRESS } from "./constants";
import { RewardAgent } from "./reward-agent";
import { TOOLS } from "./tools";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { QuestAgent } from "~~/services/quest-agent/agent";
import { db } from "~~/src/db/drizzle";

const RequestSchema = z.object({
  userAddress: z.string(),
  classificationJson: z.string(),
  questId: z.string(),
});
// Quest Check Module
export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  const isRequestValid = RequestSchema.safeParse(requestBody);

  if (!isRequestValid.success) {
    return Response.json({ error: isRequestValid.error.message }, { status: 400 });
  }

  const { userAddress, classificationJson, questId } = isRequestValid.data;

  // iterate over the quests and check if any of them match the classification
  const questAgent = new QuestAgent(db);

  const questsCompleted = await questAgent.checkIfQuestsAreCompleted(classificationJson);

  console.log(questsCompleted, "quests completed");

  //* if yes, call the reward agent
  if (questsCompleted.length > 0) {
    if (!AGENT_PRIVATE_KEY || !AGENT_ADR || !CONTRACT_ADDRESS) {
      return Response.json({ error: "Missing environment variables" }, { status: 500 });
    }

    //? We need to make sure that the user has enough SE2 to transfer or the agent should take care of it?
    const rewardAgent = new RewardAgent(TOOLS, openai("gpt-4o"));

    const AMOUNT = 0.01;

    const templatePrompt = RewardAgent.generateRewardPrompt(userAddress, "SE2", AMOUNT);

    // call the reward agent to reward the user
    const tx = await rewardAgent.rewardUser(templatePrompt);

    // call the llm to generate a structured response
    const structuredResponsePrompt = RewardAgent.generateRewardResponsePrompt(tx);

    const response = await rewardAgent.generateStructuredResponse(structuredResponsePrompt);
    console.log(structuredResponsePrompt);

    console.log("Quests completed:", questsCompleted);

    // If the quests are completed and the reward h,as been sent to the user mark them as completed in the user's quests
    if (response.result) {
      await questAgent.markQuestAsCompleted(userAddress, questId);
    }

    return Response.json({ response });
  }

  console.log("No quests completed");
  //? otherwise, use the user "upload" id to update the resource in db: status = rejected
  return Response.json({ status: "Not Quests Completed" });
}

// We might want to reward the user somehow even if they don't complete the quest
// the classification check might be tricky though if the model does not return what we want. A LLM could be used to help with this but how to pass all the quests or implement a system that makes it more efficient?
// We might want to extend the Quest table to take the transaction hash and the reward amount given to the user
// We should check for expiry of the quests
