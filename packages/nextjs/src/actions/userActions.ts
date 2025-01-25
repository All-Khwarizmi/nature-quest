"use server";

import { db } from "../db/drizzle";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function addUser(address: string) {
  await db.insert(users).values({
    address,
  });
}

export async function getUser(address: string) {
  return (await db.select().from(users).where(eq(users.address, address)))[0];
}
