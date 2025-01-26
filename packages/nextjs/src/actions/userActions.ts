"use server";

import { db } from "../db/drizzle";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function addUser(address: string) {
  return (
    await db
      .insert(users)
      .values({
        address,
      })
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
