export async function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "local";
  const branch = process.env.VERCEL_GIT_COMMIT_REF || "unknown";
  return new Response(JSON.stringify({ sha, branch }), {
    headers: { "content-type": "application/json" }
  });
}
