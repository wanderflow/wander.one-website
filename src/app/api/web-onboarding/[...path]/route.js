const API_BASE_URL = process.env.WANDER_API_BASE_URL || "https://api.wander.one";

async function proxyRequest(request, params, method) {
  const resolvedParams = await params;
  const path = (resolvedParams.path || []).join("/");
  const url = new URL(request.url);
  const targetUrl = `${API_BASE_URL}/web-onboarding/${path}${url.search}`;
  const headers = { "Content-Type": "application/json" };
  const cookie = request.headers.get("cookie");
  if (cookie) headers.cookie = cookie;

  const response = await fetch(targetUrl, {
    method,
    headers,
    body: method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });

  const body = await response.text();
  const proxyResponse = new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
      "Cache-Control": "no-store",
    },
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    proxyResponse.headers.set("set-cookie", setCookie);
  }

  return proxyResponse;
}

export async function GET(request, { params }) {
  return proxyRequest(request, params, "GET");
}

export async function POST(request, { params }) {
  return proxyRequest(request, params, "POST");
}
