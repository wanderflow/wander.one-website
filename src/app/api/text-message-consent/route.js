import { auth, currentUser } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.WANDER_API_BASE_URL || "https://api.wander.one";

async function proxy(request, update) {
  const { userId, getToken } = await auth();
  if (!userId) return Response.json({detail: "Sign in to manage text updates."}, {status: 401});
  const token = await getToken();
  if (!token) return Response.json({detail: "Authentication is not ready. Please retry."}, {status: 401});
  let body = {user_id: userId};
  if (update) {
    let input;
    try { input = await request.json(); } catch { return Response.json({detail: "Invalid request."}, {status: 400}); }
    if (typeof input.text_message_consent !== "boolean" || typeof input.phone_number !== "string") {
      return Response.json({detail: "Phone number and text consent are required."}, {status: 400});
    }
    if (input.text_message_consent) {
      const user = await currentUser();
      const verified = user?.phoneNumbers?.some((phone) => phone.phoneNumber === input.phone_number && phone.verification?.status === "verified");
      if (!verified) return Response.json({detail: "Verify this phone number before enabling text updates."}, {status: 400});
    }
    body = {...body, phone_number: input.phone_number, text_message_consent: input.text_message_consent};
  }
  const response = await fetch(`${API_BASE_URL}/users/${update ? "update" : "get"}_text_message_consent`, {
    method: "POST", headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`}, body: JSON.stringify(body), cache: "no-store",
  });
  return new Response(await response.text(), {status: response.status, headers: {"Content-Type": "application/json", "Cache-Control": "no-store"}});
}
export async function GET(request) { return proxy(request, false); }
export async function POST(request) { return proxy(request, true); }
