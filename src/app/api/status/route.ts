import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    const p = path.join(process.cwd(), "src", "status.json");
    const raw = await fs.readFile(p, "utf8");
    return new Response(raw, { headers: { "content-type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ steps: [] }), { headers: { "content-type": "application/json" } });
  }
}
