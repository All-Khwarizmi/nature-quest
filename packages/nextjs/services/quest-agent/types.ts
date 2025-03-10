import { ACTIVE, COMPLETED, EXPIRED } from "./constants";
import { PlantClassification } from "~~/app/api/quest/classification-agent";
import { TEMPORARY_User } from "~~/src/actions/userActions";

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
};

export type Quest = QuestBase & {
  id: string;
};

export interface IQuestAgent {
  generateQuest: () => Promise<QuestBase>;
  isQuestCompleted: (arg0: Quest["classification"], arg1: Quest["classification"]) => boolean;
  checkIfQuestsAreCompleted: (arg0: PlantClassification, user: TEMPORARY_User) => void;
  markQuestAsCompleted: (user: TEMPORARY_User, questId: string) => void;
  initializeQuests: () => Promise<Quest[]>;
  updateUserQuests: (userAddress: TEMPORARY_User) => void;
}
