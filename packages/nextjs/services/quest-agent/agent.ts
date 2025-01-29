import { IQuestAgent, Quest, QuestBase } from "./types";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { TEMPORARY_User } from "~~/src/actions/userActions";
import { DB, db } from "~~/src/db/drizzle";
import { quests, uploads, users } from "~~/src/db/schema";

export class QuestAgent implements IQuestAgent {
  private readonly _db: DB;
  private readonly BOTANICAL_KEYWORDS = [
    "rapeseed",
    "daisy",
    "yellow lady's slipper",
    "yellow lady-slipper",
    "Cypripedium calceolus",
    "Cypripedium parviflorum",
    "corn",
    "acorn",
    "hip",
    "rose hip",
    "rosehip",
    "buckeye",
    "horse chestnut",
    "conker",
    "cabbage",
    "broccoli",
    "cauliflower",
    "zucchini",
    "courgette",
    "spaghetti squash",
    "acorn squash",
    "butternut squash",
    "cucumber",
    "cuke",
    "artichoke",
    "globe artichoke",
    "bell pepper",
    "cardoon",
    "mushroom",
    "Granny Smith",
    "strawberry",
    "orange",
    "lemon",
    "fig",
    "pineapple",
    "ananas",
    "banana",
    "jackfruit",
    "jak",
    "jack",
    "custard apple",
    "pomegranate",
    "hay",
  ];

  private _quests: Quest[] | null = null;
  private _completedQuests: Quest[] = [];

  constructor(db: DB) {
    this._db = db;
  }

  getRandomString(arr: string[]): string {
    if (arr.length === 0) {
      throw new Error("Array must not be empty");
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  pickTargetClassification(): Quest["classification"] {
    const targetClassification = this.getRandomString(this.BOTANICAL_KEYWORDS);
    this.BOTANICAL_KEYWORDS.splice(this.BOTANICAL_KEYWORDS.indexOf(targetClassification));

    return targetClassification;
  }

  generateTitle(classification: Quest["classification"]): Quest["title"] {
    return `Take a photo of a ${classification}!`;
  }

  async generateDescription(classification: Quest["classification"]): Promise<Quest["title"]> {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `Please write a fun quest description, where a user has to take a picture of a ${classification}`,
      });

      console.log(text, "<= Quest Description");
      return text;
    } catch {
      throw new Error("error generating description in quest agent");
    }
  }

  getRandomExpiryDate(): Date {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 30) + 1; // Random number between 1 and 30
    now.setDate(now.getDate() + randomDays); // Add random days to the current date
    return now;
  }

  getRandomReward(): number {
    return Math.floor(Math.random() * 20 + 1) * 5;
  }

  getRandomMaxUsers(): number {
    return Math.floor(Math.random() * 10 + 1) * 5;
  }

  async generateQuest(): Promise<QuestBase> {
    try {
      const targetClassification = this.pickTargetClassification();
      const title = this.generateTitle(targetClassification);
      const description = await this.generateDescription(targetClassification);

      return {
        title: title,
        classification: targetClassification,
        userCount: 0,
        maxUsers: this.getRandomMaxUsers(),
        description: description,
        reward: this.getRandomReward(),
        createdAt: new Date(),
        expiresAt: this.getRandomExpiryDate(),
      };
    } catch {
      throw new Error("error generateQuest() in quest agent");
    }
  }

  isQuestCompleted(captureClassification: Quest["classification"], dbClassification: Quest["classification"]): boolean {
    if (captureClassification === dbClassification) {
      return true;
    }
    return false;
  }

  async initializeQuests() {
    try {
      if (this._quests) {
        return this._quests;
      }
      const allQuests = await this._db.select().from(quests);
      this._quests = allQuests;

      return allQuests;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async checkIfQuestsAreCompleted(captureClassification: Quest["classification"]) {
    try {
      const allQuests = await this.initializeQuests();

      const completedQuests: Quest[] = [];

      // check if any of the quests match the classification
      allQuests.forEach(quest => {
        if (this.isQuestCompleted(captureClassification, quest.classification)) {
          completedQuests.push(quest);
        }
      });

      this._completedQuests = completedQuests;
      return completedQuests;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async markQuestAsCompleted(userAddress: string, questId: string) {
    try {
      console.log(userAddress, questId, "inside mark quest as completed");
      // fetch the user from the db
      const [user] = (await db.select().from(users).where(eq(users.address, userAddress))) as TEMPORARY_User[];
      if (!user) {
        throw new Error("User not found");
      }

      // Mark the quest as completed in the user's quests
      const updatedQuests = {
        // Add the completed quests to the user's completed quests array
        completed: user.quests.completed.concat(this._completedQuests.map(quest => quest.id)),

        // Filter out the completed quests from the pending quests
        pending: user.quests.pending.filter(
          questId => !this._completedQuests.some(completedQuest => completedQuest.id === questId),
        ),
      };

      console.log(updatedQuests, "updated quests");

      // Assign a new quest to the user if there are any pending quests
      const potentialQuests = this._quests
        ?.filter(quest => !updatedQuests.completed.includes(quest.id) && !updatedQuests.pending.includes(quest.id))
        .sort(() => Math.random() - 0.5);

      if (potentialQuests && potentialQuests.length > 0) {
        const [newQuest] = potentialQuests;
        console.log(newQuest, "new quest");
        updatedQuests.pending.push(newQuest.id);
      } else {
        console.error("No quests available to assign to the user");
      }

      console.log(updatedQuests, "updated quests with new quest");

      // Update the user's quests in the database
      const updatedUser = (await db
        .update(users)
        .set({ quests: updatedQuests })
        .where(eq(users.address, userAddress))
        .returning()) as TEMPORARY_User[];

      console.log(updatedUser, "updated user");

      // Mark user upload as completed
      // TODO: type safety of the status
      await db.update(uploads).set({ status: "approved" }).where(eq(uploads.id, questId));

      // Update the quests in the database
      const questsToUpdateAsync = this._completedQuests.map(async quest => {
        await db
          .update(quests)
          .set({ userCount: (quest.userCount || 0) + 1 })
          .where(eq(quests.id, quest.id));
      });

      const result = await Promise.allSettled(questsToUpdateAsync);

      console.log(result, "result");
    } catch (error) {
      console.error(error);
    }
  }
}
