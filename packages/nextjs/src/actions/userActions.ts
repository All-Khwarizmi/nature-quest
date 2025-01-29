"use server";

import { db } from "../db/drizzle";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// TODO: Decide where to place type, nullable stuff
export type TEMPORARY_User = {
  id: string; // UUID for the user ID
  address: string; // User's wallet address
  createdAt: Date; // Timestamp for when the user was created
  updatedAt: Date; // Timestamp for when the user was last updated
  quests: {
      pending: string[]; // Array of quest IDs that are pending
      completed: string[]; // Array of quest IDs that have been completed
  };
  totalQuestsCompleted: number; // Total number of quests completed
  lastQuestCompletedAt?: Date | null; // Optional timestamp for the last quest completed
};

export default async function addUser(address: string) {
  // TODO: update quests to be an array of quest ids
  return (
    await db
      .insert(users)
      .values({ address: address, quests: { pending: ["Tree Spotter"], completed: ["Bird Basics"] } })
      .returning()
  )[0];
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

export async function updateCompletedUserQuests(address: string, completedQuests: string[]): Promise<TEMPORARY_User[]> {
  if (completedQuests.length === 0) return [];

  console.log(completedQuests, 'these are completed quests')

  const user = await getUser(address) as TEMPORARY_User;
  if (!user) throw new Error("User not found");
  console.log(user, 'this is user from getUser()')

  // Remove completed quests from pending
  console.log(user.quests.pending, 'current pending array')
  console.log(user.quests.completed, 'current completed array')
  const updatedPending = user.quests.pending.filter(q => !completedQuests.includes(q));
  const updatedCompleted = user.quests.completed.concat(completedQuests);
  console.log(user.quests.pending, 'pending array after update')
  console.log(updatedCompleted, 'updatedcompleted')

  return await db
      .update(users)
      .set({ quests: { pending: updatedPending, completed: updatedCompleted } })
      .where(eq(users.address, address))
      .returning() as TEMPORARY_User[];
}