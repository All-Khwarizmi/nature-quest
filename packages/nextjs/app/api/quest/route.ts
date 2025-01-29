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
  uploadId: z.string(),
});
// Quest Check Module
export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  const isRequestValid = RequestSchema.safeParse(requestBody);

  if (!isRequestValid.success) {
    return Response.json({ error: isRequestValid.error.message }, { status: 400 });
  }

  const { userAddress, classificationJson, uploadId } = isRequestValid.data;
  console.log({ userAddress, classificationJson, uploadId });

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

    const AMOUNT = questAgent.getRewardAmount();

    const templatePrompt = RewardAgent.generateRewardPrompt(userAddress, "SE2", AMOUNT);

    // Call the reward agent to reward the user
    const tx = await rewardAgent.rewardUser(templatePrompt);

    // Call the llm to generate a structured response
    const structuredResponsePrompt = RewardAgent.generateRewardResponsePrompt(tx);

    const response = await rewardAgent.generateStructuredResponse(structuredResponsePrompt);
    console.log(structuredResponsePrompt);

    console.log("Quests completed:", questsCompleted);

    // If the quests are completed and the reward h,as been sent to the user mark them as completed in the user's quests
    if (response.result) {
      await questAgent.markQuestAsCompleted(userAddress, uploadId);
    }

    return Response.json({ response });
  }

  console.log("No quests completed");
  //? otherwise, use the user "upload" id to update the resource in db: status = rejected
  return Response.json({ status: "Not Quests Completed" });
}

// Onboarding flow
// If the user has not completed any quests, we assign them a quest
// Create a getFirstQuest() function that returns the first quest in the array to show to the new comer

// On user creation we assign quests

//? Reward flow
// Expand the user upload table to include the transaction hash and the quests completed and the reward amount given to the user
// Add a claim button to trigger the reward flow?

// We reward the user somehow even if they don't complete the quest?
// the classification check might be tricky though if the model does not return what we want. A LLM could be used to help with this but how to pass all the quests or implement a system that makes it more efficient?
// We might want to extend the Quest table to take the transaction hash and the reward amount given to the user
// We should check for expiry of the quests

// TODO:
// Missing features:
// 1. Onboarding flow
// 2. Adapt to user preferences (quests creation/ assignment / )
// 3. Add quality control of the user uploads
// 3. Add a claim button to trigger the reward flow
