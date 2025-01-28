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