import { QuestAgent } from "./agent"
import { Quest, QuestBase } from "./types";

const questAgent = new QuestAgent();

export const generateQuest = async(): Promise<QuestBase> => {
    try {
        return await questAgent.generateQuest(); 
    } catch (error) {
        throw new Error('error in generateQuest index.ts')
    }
};

export const isQuestCompleted = (captureClassification: Quest["classification"], pendingQuestClassification: Quest["classification"]): boolean => {
    return questAgent.isQuestCompleted(captureClassification, pendingQuestClassification)
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

export const getCompletedQuests = (captureClassification: Quest["classification"], pendingQuests: Quest["classification"][]): Quest["classification"][] => {
    return pendingQuests.filter(pendingQuests => isQuestCompleted(captureClassification, pendingQuests))
}