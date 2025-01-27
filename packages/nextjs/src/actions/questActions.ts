"use server";

import { db } from "../db/drizzle";
import { quests } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getQuests() {
  return db.select().from(quests);
}

export async function getQuestByTitle(title: string) {
  return db.select().from(quests).where(eq(quests.title, title));
}
