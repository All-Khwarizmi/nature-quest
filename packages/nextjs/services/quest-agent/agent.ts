import { IQuestAgent, Quest, QuestBase } from "./types";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { DB } from "~~/src/db/drizzle";
import { quests } from "~~/src/db/schema";

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

      return completedQuests;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  markQuestAsCompleted() {
    // take in a quest, and a user.
  }
}
