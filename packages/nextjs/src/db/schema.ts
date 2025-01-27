import { max } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, point, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { title } from "process";

// Users (identified by wallet address)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  address: text("address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  quests: jsonb("quests").notNull(),
});

// // Companies/Organizations that can sponsor quests
// export const companies = pgTable("companies", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   name: text("name").notNull(),
//   address: text("address").notNull().unique(), // wallet address
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// Quests (can be sponsored or public)
export const quests = pgTable("quests", {
  id: uuid("id").defaultRandom().primaryKey(),
  // companyId: uuid("company_id").references(() => companies.id), // optional sponsor
  title: text("title").notNull(),
  classification: text("classification").notNull(),
  userCount: integer("user_count"),
  maxUsers: integer("max_users"),
  description: text("description").notNull(),
  reward: integer("reward").notNull(),
  // isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// User uploads with rich metadata
export const uploads = pgTable("uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  questId: uuid("quest_id"), //.references(() => quests.id), // optional quest
  imageUrl: text("image_url").notNull(),
  classificationJson: jsonb("classification_json").notNull(), // MobileNet results
  status: text("status").notNull().default("pending"), // pending, approved, rejected

  // Optional metadata
  location: point("location"),
  season: text("season"),
  photoTakenAt: timestamp("photo_taken_at"),
  metadata: jsonb("metadata"), // flexible additional metadata

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
// export type Company = typeof companies.$inferSelect;
export type Quest = typeof quests.$inferSelect;
export type Upload = typeof uploads.$inferSelect;
