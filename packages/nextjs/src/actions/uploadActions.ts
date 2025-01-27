"use server";

import { db } from "../db/drizzle";
import { Upload, uploads, users } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function addUpload(upload: Omit<Upload, "id">) {
  return (await db.insert(uploads).values(upload).returning())[0];
}

export async function getUploadsByUserId(userAddress: string) {
  const userId = (await db.select().from(users).where(eq(users.address, userAddress)))[0].id;
  if (userId.length === 0) {
    return [];
  }
  return await db.select().from(uploads).where(eq(uploads.userId, userId));
}
