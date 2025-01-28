import { ACTIVE, COMPLETED, EXPIRED } from "./constants";

export type Reward = object;
export type Status = typeof ACTIVE | typeof COMPLETED | typeof EXPIRED;
export type Requirement = object;

export type QuestBase = {
    title: string;
    classification: string;
    userCount: number | null;
    maxUsers: number | null;
    description: string;
    reward: number;
    createdAt: Date | null;
    expiresAt: Date | null;
}

export type Quest = QuestBase & {
    id: string;
}

export interface IQuestAgent {
    generateQuest: () => Promise<QuestBase>;
    checkQuestCompleted: <T>(arg0: T, arg1: T) => boolean;
}
