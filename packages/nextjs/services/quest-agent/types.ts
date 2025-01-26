import { ACTIVE, COMPLETED, EXPIRED } from "./constants";

export type Reward = object;
export type Status = typeof ACTIVE | typeof COMPLETED | typeof EXPIRED;

export type Quest = {
    id: string;
    company_id: string;
    title: string;
    description: string;
    reward: Reward;
    status: Status;
}

export interface IQuestAgent {
    generateQuest: () => Promise<Quest>
}