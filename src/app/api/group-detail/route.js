const API_URL = "https://api.wander.one/ai-topics/invite_links/detail";

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(text, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
