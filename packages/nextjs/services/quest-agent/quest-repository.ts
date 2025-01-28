"use server"

import { db } from "~~/src/db/drizzle";
import { quests } from "~~/src/db/schema";
import { Quest, QuestBase } from "./types";

export class QuestRepository {
    private db;

    constructor() {
        this.db = db;
    }

    // right now, this is done on a per user basis, and needs to be changed to be on a system basis
    async createQuest(quest: QuestBase): Promise<Quest> {
        try {
            const [newQuest] = await db
            .insert(quests)
            .values(quest)
            .returning();
    
            return newQuest;
        } catch {
            throw new Error('error inserting new quest into db')
        }
    }
}