import { ACTIVE, COMPLETED, EXPIRED } from "./constants";

export type Reward = object;
export type Status = typeof ACTIVE | typeof COMPLETED | typeof EXPIRED;
export type Requirement = object;

export type Quest = {
    id: string;
    company_id: string;
    title: string;
    description: string;
    reward: Reward;
    status: Status;
    requirements: Requirement;
    is_public: boolean;
    created_at: number;
    expires_at: number;
}

export interface IQuestAgent {
    generateQuest: () => Promise<Quest>;
    // checkQuestCompleted: ;

}