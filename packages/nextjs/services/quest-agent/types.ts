import { ACTIVE, COMPLETED, EXPIRED } from "./constants";

export type Reward = object;
export type Status = typeof ACTIVE | typeof COMPLETED | typeof EXPIRED;
export type Requirement = object;

export type Quest = {
    id: string;
    title: string;
    classification: string;
    userCount?: number;
    maxUsers?: number;
    description: string;
    reward: number;
    createdAt: Date;
    expiresAt?: Date;
}

export interface IQuestAgent {
    generateQuest: () => Promise<Quest>;
    // checkQuestCompleted: ;

}