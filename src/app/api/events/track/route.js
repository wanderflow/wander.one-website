const API_BASE_URL = process.env.WANDER_API_BASE_URL || "https://api.wander.one";

export async function POST(request) {
  const targetUrl = `${API_BASE_URL}/events/track`;
  const response = await fetch(targetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
    cache: "no-store",
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
}
