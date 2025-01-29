// Usage in API route
import { ClassificationAgent } from "../quest/reward-agent";
import { openai } from "@ai-sdk/openai";

// pages/api/classify.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const agent = new ClassificationAgent(openai("gpt-4o"));
  const result = await agent.classifyImage(file);
  console.log({ result });

  return Response.json(result);
}
