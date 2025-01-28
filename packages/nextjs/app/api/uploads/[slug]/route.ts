import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "~~/src/db/drizzle";
import * as schema from "~~/src/db/schema";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const upload = await db.select().from(schema.uploads).where(eq(schema.uploads.id, params.slug)).execute();

    if (!upload || upload.length === 0) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    return NextResponse.json(upload[0]);
  } catch (error) {
    console.error("Error fetching upload:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
