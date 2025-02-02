"use server";

import { db } from "../db/drizzle";
import { users } from "../db/schema";
import type { Quest } from "../db/schema";
import { eq, sql } from "drizzle-orm";

// TODO: Decide where to place type, nullable stuff
export type TEMPORARY_User = {
  id: string; // UUID for the user ID
  address: string; // User's wallet address
  createdAt: Date | null; // Timestamp for when the user was created
  updatedAt: Date | null; // Timestamp for when the user was last updated
  quests: {
    pending: string[]; // Array of quest IDs that are pending
    completed: string[]; // Array of quest IDs that have been completed
  };
  totalQuestsCompleted: number; // Total number of quests completed
  lastQuestCompletedAt?: Date | null; // Optional timestamp for the last quest completed
};

const DEFAULT_QUEST = {
  pending: [],
  completed: ["8e03aa6d-baf1-413e-8243-3487c64ee95d"],
};

export default async function addUser(address: string) {
  // TODO: update quests to be an array of quest ids
  return (await db.insert(users).values({ address: address, quests: DEFAULT_QUEST }).returning())[0];
}

export async function getUser(address: string) {
  const usersData = await db.select().from(users).where(eq(users.address, address));
  if (usersData.length === 0) {
    return null;
  }
  return usersData[0];
}

export async function getUserByAddress(address: string) {
  return (await db.select().from(users).where(eq(users.address, address)))[0];
}

export async function moveQuestToCompleted(address: string, questToMove: string): Promise<TEMPORARY_User[]> {
  const user = (await getUser(address)) as TEMPORARY_User;
  if (!user) {
    throw new Error("User not found");
  }

  // Check if the quest is in the pending array
  if (!user.quests.pending.includes(questToMove)) {
    throw new Error("Quest not found in pending list");
  }

  const updatedQuests = {
    completed: user.quests.completed.concat(questToMove),
    pending: user.quests.pending.filter(quest => quest !== questToMove),
  };

  return (await db
    .update(users)
    .set({ quests: updatedQuests })
    .where(eq(users.address, address))
    .returning()) as TEMPORARY_User[];
}

export async function addQuestToPending(address: string, questToAdd: Quest): Promise<void> {
  await db
    .update(users)
    .set({
      quests: sql`${users.quests} || jsonb_build_object('pending', (quests->'pending')::jsonb || ${JSON.stringify([questToAdd.id])}::jsonb)`,
    })
    .where(eq(users.address, address))
    .returning();
}
