import { QuestAgent } from "./agent";
import { Quest } from "./types";

const questAgent = new QuestAgent();

export const generateQuest = async (): Promise<Quest> => {
  try {
    return await questAgent.generateQuest();
  } catch (error) {
    throw new Error("error in generateQuest index.ts");
  }
};
