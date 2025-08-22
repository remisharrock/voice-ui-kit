import { getLLMSummary } from "@/lib/llm";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const scan = source.getPages().map(getLLMSummary);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
