import { NextRequest } from "next/server";
import { AGENT_ADR, AGENT_PRIVATE_KEY, CONTRACT_ADDRESS } from "./constants";
import { RewardAgent } from "./reward-agent";
import { TOOLS } from "./tools";
import { openai } from "@ai-sdk/openai";
import { QuestAgent } from "~~/services/quest-agent/agent";
import { db } from "~~/src/db/drizzle";

// Quest Check Module
export async function POST(req: NextRequest) {
  //~ Check step
  const { userAddress, classificationJson } = await req.json();

  // iterate over the quests
  const questAgent = new QuestAgent(db);

  const questsCompleted = await questAgent.checkIfQuestsAreCompleted(classificationJson);

  //* if yes, call the reward agent
  if (questsCompleted.length > 0) {
    if (!AGENT_PRIVATE_KEY || !AGENT_ADR || !CONTRACT_ADDRESS) {
      return Response.json({ error: "Missing environment variables" }, { status: 500 });
    }

    //? We need to make sure that the user has enough SE2 to transfer or the agent should take care of it?
    const AMOUNT = 0.01;

    const templatePrompt = RewardAgent.generateRewardPrompt(userAddress, "SE2", AMOUNT);

    const rewardAgent = new RewardAgent(TOOLS, openai("gpt-4o"));
    const tx = await rewardAgent.rewardUser(templatePrompt);

    // call the llm to generate a structured response
    const structuredResponsePrompt = RewardAgent.generateRewardResponsePrompt(tx);

    const response = await rewardAgent.generateStructuredResponse(structuredResponsePrompt);
    console.log(structuredResponsePrompt);

    console.log("Quests completed:", questsCompleted);

    return Response.json({ response });
  }
  //? otherwise, use the user "upload" id to update the resource in db: status = rejected
  return Response.json({ status: "not completed" });
}

// We might want to reward the user somehow even if they don't complete the quest
// the classification check might be tricky though if the model does not return what we want. A LLM could be used to help with this but how to pass all the quests or implement a system that makes it more efficient?
