import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) throw Error("No database URL env variable");

export const db = drizzle(process.env.DATABASE_URL);
