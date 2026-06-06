export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Document, renderToStream } from "@react-pdf/renderer";
import React from "react";
import { InvoiceDocument } from "@/components/InvoiceDocument";
import { CORS_HEADERS, validateApiKey } from "@/lib/api-auth";
import { fakeInvoice } from "./fakePayLoad";

async function renderInvoicePdf(payload) {
  const stream = await renderToStream(
    <Document>
      <InvoiceDocument payload={payload} />
    </Document>
  );

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=invoice-${payload.id || "dev"}.pdf`,
      ...CORS_HEADERS,
    },
  });
}

export async function POST(req) {
  const auth = validateApiKey(req);
  if (!auth.ok) return auth.response;

  let payload;
  try {
    payload = await req.json();
  } catch {
    payload = fakeInvoice;
  }
  return renderInvoicePdf(payload);
}

export async function GET(req) {
  const auth = validateApiKey(req);
  if (!auth.ok) return auth.response;

  return renderInvoicePdf(fakeInvoice);
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}
