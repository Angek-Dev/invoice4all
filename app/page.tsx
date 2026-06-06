import Link from "next/link";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { MethodBadge } from "@/components/docs/MethodBadge";
import { SchemaTable } from "@/components/docs/SchemaTable";
import { examplePayloadJson } from "@/lib/example-payload";

const nav = [
  { id: "overview", label: "Overview" },
  { id: "quickstart", label: "Quick start" },
  { id: "api", label: "API reference" },
  { id: "authentication", label: "Authentication" },
  { id: "schema", label: "Payload schema" },
  { id: "example", label: "Example payload" },
  { id: "customize", label: "Customization" },
  { id: "deploy", label: "Deployment" },
];

const rootFields = [
  { field: "id", type: "string", required: true, description: "Invoice number displayed on the PDF" },
  { field: "load_number", type: "string", required: true, description: "Reference number value shown next to the label" },
  { field: "load_number_label", type: "string", required: false, description: 'Label before the reference (e.g. "Shipment" → "Shipment:")', default: "Load" },
  { field: "date", type: "string", required: true, description: "ISO 8601 date (e.g. 2025-06-06T12:00:00.000Z)" },
  { field: "timezone", type: "string", required: true, description: "IANA timezone for formatting the invoice date" },
  { field: "carrier", type: "object", required: true, description: "Payee / trucking company" },
  { field: "broker", type: "object", required: true, description: "Bill-to party" },
  { field: "items", type: "array", required: true, description: "Line items (see below)" },
  { field: "color", type: "string", required: false, description: "Primary accent color, hex without #", default: "134A9E" },
  { field: "secondaryColor", type: "string", required: false, description: "Table header color, hex without #" },
  { field: "adjustments", type: "object", required: false, description: "Fee adjustments (see below)" },
];

const partyFields = [
  { field: "name", type: "string", required: true, description: "Company or contact name" },
  { field: "address", type: "string", required: true, description: "Street address line" },
  { field: "address2", type: "string", required: true, description: "City, state, and ZIP line" },
  { field: "phone", type: "string", required: true, description: "Phone number (formatted on output)" },
  { field: "email", type: "string", required: true, description: "Email address" },
];

const itemFields = [
  { field: "description", type: "string", required: true, description: 'Line item title (e.g. "Line Haul")' },
  { field: "notes", type: "string", required: false, description: "Extra notes shown under the description" },
  { field: "quantity", type: "number", required: true, description: "Quantity" },
  { field: "cost", type: "number", required: true, description: "Unit rate in USD" },
  { field: "stops", type: "array", required: true, description: "Pickup and delivery stops" },
];

const stopFields = [
  { field: "type", type: "string", required: true, description: 'e.g. "Pickup", "Delivery"' },
  { field: "city", type: "string", required: true, description: "Location label or address" },
  { field: "state", type: "string", required: false, description: "State abbreviation" },
  { field: "zip", type: "string", required: false, description: "ZIP / postal code" },
  { field: "datetime", type: "string", required: false, description: "ISO date for the first date column" },
  { field: "datetime2", type: "string", required: false, description: "Optional second date" },
];

const adjustmentFields = [
  { field: "quickpayFeePercent", type: "number", required: false, description: "Percentage deducted from subtotal", default: "0" },
  { field: "fixedFee", type: "number", required: false, description: "Flat fee added to the total", default: "0" },
];

export default function DocsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#134A9E] text-sm font-bold text-white">
              i4
            </div>
            <div>
              <p className="text-sm font-semibold">invoice4all</p>
              <p className="text-xs text-slate-500">PDF invoice API</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/api"
              target="_blank"
              className="hidden rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-block"
            >
              Sample PDF
            </Link>
            <a
              href="#api"
              className="rounded-lg bg-[#134A9E] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#0f3a7d]"
            >
              API reference
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10">
        <aside className="hidden w-48 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block rounded-md px-3 py-1.5 text-slate-600 transition hover:bg-white hover:text-[#134A9E]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-16">
          <section id="overview" className="scroll-mt-24">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[#134A9E]">
              Documentation
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Generate logistics invoices as PDFs
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              invoice4all is a Next.js API that accepts invoice JSON and returns a
              professional PDF. Built for trucking workflows with carrier/broker details,
              load numbers, stops, and fee adjustments.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/api"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg bg-[#134A9E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0f3a7d]"
              >
                View sample PDF
                <span aria-hidden>→</span>
              </Link>
              <a
                href="#quickstart"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Get started
              </a>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                "REST API with GET and POST endpoints",
                "Logistics layout with pickup/delivery stops",
                "Quick-pay and fixed fee adjustments",
                "Custom brand colors per invoice",
                "CORS enabled for browser clients",
                "Total amount written in words",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  <span className="mt-0.5 text-[#134A9E]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section id="quickstart" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900">Quick start</h2>
            <p className="mt-3 text-slate-600">
              Requires Node.js 18.18+. Clone the repo, install dependencies, and start
              the dev server.
            </p>
            <div className="mt-6 space-y-4">
              <CodeBlock
                title="Install & run"
                code={`npm install\nnpm run dev`}
              />
              <p className="text-sm text-slate-600">
                The API is served at{" "}
                <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                  {baseUrl}/api
                </code>
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2.5 font-medium">Command</th>
                    <th className="px-4 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["npm run dev", "Start dev server (Turbopack)"],
                    ["npm run build", "Production build"],
                    ["npm run start", "Serve production build"],
                    ["npm run lint", "Run ESLint"],
                  ].map(([cmd, desc]) => (
                    <tr key={cmd} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-mono text-xs text-[#134A9E]">{cmd}</td>
                      <td className="px-4 py-3 text-slate-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="api" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900">API reference</h2>
            <p className="mt-3 text-slate-600">
              Base URL:{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">/api</code>.
              Successful responses return{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                application/pdf
              </code>{" "}
              with inline disposition.
            </p>

            <div className="mt-8 space-y-10">
              <article className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <MethodBadge method="GET" />
                  <code className="font-mono text-sm font-semibold text-slate-800">/api</code>
                </div>
                <p className="mt-4 text-slate-600">
                  Returns a sample invoice PDF using built-in demo data. Ideal for
                  previewing the template.
                </p>
                <div className="mt-4">
                  <CodeBlock
                    language="curl"
                    code={`curl -o sample-invoice.pdf ${baseUrl}/api \\\n  -H "x-api-key: your-api-key"`}
                  />
                </div>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <MethodBadge method="POST" />
                  <code className="font-mono text-sm font-semibold text-slate-800">/api</code>
                </div>
                <p className="mt-4 text-slate-600">
                  Generates a PDF from a JSON invoice payload. Send{" "}
                  <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                    Content-Type: application/json
                  </code>
                  . If the body is missing or invalid, the API falls back to demo data.
                </p>
                <div className="mt-4 space-y-4">
                  <CodeBlock
                    language="curl"
                    code={`curl -X POST ${baseUrl}/api \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: your-api-key" \\\n  -d @invoice.json \\\n  -o invoice.pdf`}
                  />
                  <CodeBlock
                    language="javascript"
                    title="fetch"
                    code={`const response = await fetch("${baseUrl}/api", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "x-api-key": "your-api-key",\n  },\n  body: JSON.stringify(invoicePayload),\n});\n\nconst blob = await response.blob();\nconst url = URL.createObjectURL(blob);\nwindow.open(url);`}
                  />
                </div>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <MethodBadge method="OPTIONS" />
                  <code className="font-mono text-sm font-semibold text-slate-800">/api</code>
                </div>
                <p className="mt-4 text-slate-600">
                  CORS preflight. Returns allowed methods (GET, POST, OPTIONS) and
                  headers. All origins are permitted.
                </p>
              </article>
            </div>
          </section>

          <section id="authentication" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900">Authentication</h2>
            <p className="mt-3 text-slate-600">
              Protect the API by setting{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                INVOICE_API_KEYS
              </code>{" "}
              in your environment. Use a comma-separated list to allow multiple keys.
              When unset, authentication is disabled (useful for local development).
            </p>
            <div className="mt-6">
              <CodeBlock
                title=".env"
                language="env"
                code={`INVOICE_API_KEYS=your-secret-key-here,another-key`}
              />
            </div>
            <p className="mt-4 text-slate-600">
              Send a valid key on every{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">GET</code>{" "}
              or{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">POST</code>{" "}
              request using either header:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-xs">
                x-api-key: your-api-key
              </li>
              <li className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-xs">
                Authorization: Bearer your-api-key
              </li>
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              Invalid or missing keys return{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">401</code>{" "}
              with a JSON error body.
            </p>
          </section>

          <section id="schema" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900">Payload schema</h2>
            <p className="mt-3 text-slate-600">
              The{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                InvoicePayload
              </code>{" "}
              type is defined in{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                components/InvoiceDocument.tsx
              </code>
              .
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Total:{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                subtotal - quickpayFee + fixedFee
              </code>
              , where subtotal = Σ(quantity × cost).
            </p>

            <div className="mt-8 space-y-6">
              <SchemaTable rows={rootFields} title="Root fields" />
              <SchemaTable rows={partyFields} title="carrier / broker" />
              <SchemaTable rows={itemFields} title="items[]" />
              <SchemaTable rows={stopFields} title="items[].stops[]" />
              <SchemaTable rows={adjustmentFields} title="adjustments" />
            </div>
          </section>

          <section id="example" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900">Example payload</h2>
            <p className="mt-3 text-slate-600">
              Use this JSON body with a POST request. Demo data also lives in{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                app/api/fakePayLoad.ts
              </code>
              .
            </p>
            <div className="mt-6">
              <CodeBlock language="json" title="invoice.json" code={examplePayloadJson} />
            </div>
          </section>

          <section id="customize" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900">Customization</h2>
            <p className="mt-3 text-slate-600">
              Edit{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                components/InvoiceDocument.tsx
              </code>{" "}
              to change layout, typography, or fields. The template uses react-pdf
              primitives (Page, View, Text, StyleSheet).
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <strong className="text-slate-900">Colors</strong> — pass{" "}
                <code className="font-mono text-xs text-[#134A9E]">color</code> and{" "}
                <code className="font-mono text-xs text-[#134A9E]">secondaryColor</code>{" "}
                in the payload, or change defaults in the component.
              </li>
              <li className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <strong className="text-slate-900">Fonts</strong> — Roboto is registered
                in the component; add .ttf files under{" "}
                <code className="font-mono text-xs">public/fonts/</code> to use them.
              </li>
              <li className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <strong className="text-slate-900">Types</strong> — the exported{" "}
                <code className="font-mono text-xs text-[#134A9E]">InvoicePayload</code>{" "}
                type is the source of truth for the JSON shape.
              </li>
            </ul>
          </section>

          <section id="deploy" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900">Deployment</h2>
            <p className="mt-3 text-slate-600">
              Standard Next.js 15 app — deploy to Vercel or any Node.js host that supports
              the App Router.
            </p>
            <div className="mt-6">
              <CodeBlock code={`npm run build\nnpm run start`} title="Production" />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Point client apps at your production URL, e.g.{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                https://your-app.vercel.app/api
              </code>
            </p>

            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">Tech stack</h3>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                {["Next.js 15", "React 19", "@react-pdf/renderer", "number-to-words", "Tailwind CSS 4"].map(
                  (tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium"
                    >
                      {tech}
                    </li>
                  )
                )}
              </ul>
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        invoice4all — PDF invoice generation API
      </footer>
    </div>
  );
}
