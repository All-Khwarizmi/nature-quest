"use server";

import { db } from "../db/drizzle";
import { Upload, uploads } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function addUpload(upload: Upload) {
  return db.insert(uploads).values(upload);
}

export async function getUploadsByUserId(userId: string) {
  return db.select().from(uploads).where(eq(uploads.userId, userId));
}
