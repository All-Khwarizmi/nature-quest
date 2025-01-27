"use server";

import { db } from "../db/drizzle";
import { Upload, uploads } from "../db/schema";
import { getUserByAddress } from "./userActions";
import { eq } from "drizzle-orm";

export default async function addUpload(upload: Omit<Upload, "id">) {
  return (await db.insert(uploads).values(upload).returning())[0];
}

export async function getUploadsByUserId(userAddress: string) {
  const userId = (await getUserByAddress(userAddress)).id;
  if (userId.length === 0) {
    return [];
  }
  return await db.select().from(uploads).where(eq(uploads.userId, userId));
}
