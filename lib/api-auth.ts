import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
} as const;

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function getValidApiKeys(): string[] {
  const raw = process.env.INVOICE_API_KEYS ?? "";
  return raw
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

export function isApiKeyRequired(): boolean {
  return getValidApiKeys().length > 0;
}

export function extractApiKey(req: Request): string | null {
  const headerKey = req.headers.get("x-api-key");
  if (headerKey) return headerKey.trim();

  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }

  return null;
}

function unauthorized(message: string) {
  return NextResponse.json(
    { error: message },
    { status: 401, headers: CORS_HEADERS }
  );
}

export function validateApiKey(
  req: Request
): { ok: true } | { ok: false; response: NextResponse } {
  const validKeys = getValidApiKeys();
  if (validKeys.length === 0) return { ok: true };

  const provided = extractApiKey(req);
  if (!provided) {
    return {
      ok: false,
      response: unauthorized(
        "Missing API key. Send x-api-key or Authorization: Bearer <key>."
      ),
    };
  }

  const isValid = validKeys.some((key) => safeCompare(provided, key));
  if (!isValid) {
    return { ok: false, response: unauthorized("Invalid API key.") };
  }

  return { ok: true };
}
