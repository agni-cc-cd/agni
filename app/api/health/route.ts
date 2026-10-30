export async function GET() {
  return Response.json({ ok: true, service: "agni", ts: new Date().toISOString() });
}
