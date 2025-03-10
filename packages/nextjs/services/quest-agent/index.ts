import { QuestValidationAgent } from "../quest-validation-agent/quest-validation-agent";
import { QuestAgent } from "./agent";
import { Quest, QuestBase } from "./types";
import { openai } from "@ai-sdk/openai";
import { db } from "~~/src/db/drizzle";

const validationAgent = new QuestValidationAgent(openai("gpt-4o"));
const questAgent = new QuestAgent(db, validationAgent);

export const generateQuest = async (): Promise<QuestBase> => {
  try {
    return await questAgent.generateQuest();
  } catch (error) {
    throw new Error("error in generateQuest index.ts");
  }
};

export const isQuestCompleted = (
  captureClassification: Quest["classification"],
  pendingQuestClassification: Quest["classification"],
): boolean => {
  return questAgent.isQuestCompleted(captureClassification, pendingQuestClassification);
};

// TODO: properly type pendingQuests.  In
// quests: jsonb("quests").notNull().default({
//     pending: [], <== what is the shape of the quests?

// current neon shape: {
//   "pending": [
//     "Tree Spotter"
//   ],
//   "completed": [
//     "Bird Basics"
//   ]
// }

// utility function
export const checkIfQuestsAreCompleted = (
  captureClassification: Quest["classification"],
  pendingQuests: Quest["title"][],
) => {
  pendingQuests.forEach((pendingQuest: Quest["classification"]) => {
    if (isQuestCompleted(captureClassification, pendingQuest)) {
      console.log("Quest was completed, call reward agent here");
      // TODO: in the 'users' table, move pendingQuest into completed quest array in the users
      // optional: generateQuest()
    }
  });
};
