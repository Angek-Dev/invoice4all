# invoice4all

A Next.js API service that generates professional PDF invoices for trucking and logistics workflows. Send invoice data as JSON and receive a ready-to-download PDF — no UI required.

Built with [@react-pdf/renderer](https://react-pdf.org/) for server-side PDF generation.

## Features

- **REST API** — `GET` for a sample invoice, `POST` with your own payload
- **Logistics-focused layout** — carrier/broker details, load numbers, line items with pickup/delivery stops
- **Dynamic adjustments** — unlimited additions and deductions in the totals section
- **Branding** — customizable primary and secondary colors (hex, without `#`)
- **Custom reference label** — rename "Load:" to "Shipment:" (or any label) per invoice
- **API key auth** — optional key protection via `INVOICE_API_KEYS`
- **CORS enabled** — callable from browser-based apps on other origins
- **Amount in words** — total displayed in written form (e.g. "Two thousand")

## Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- npm (or yarn, pnpm, bun)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment (optional)

Copy `.env.example` to `.env.local` and set API keys for production:

```bash
INVOICE_API_KEYS=your-secret-key-here
```

When `INVOICE_API_KEYS` is unset, the API is open (no auth). When set, all `GET` and `POST` requests require a valid key.

### 3. Run the development server

```bash
npm run dev
```

The API is available at [http://localhost:3000/api](http://localhost:3000/api). Documentation is at [http://localhost:3000](http://localhost:3000).

### 4. Other scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start dev server (Turbopack)   |
| `npm run build`| Production build               |
| `npm run start`| Serve production build         |
| `npm run lint` | Run ESLint                     |

## API usage

Base URL: `/api`

All successful responses return `application/pdf` with `Content-Disposition: inline`.

### Authentication

When `INVOICE_API_KEYS` is set, send a valid key on every request:

| Header | Example |
| ------ | ------- |
| `x-api-key` | `x-api-key: your-secret-key` |
| `Authorization` | `Authorization: Bearer your-secret-key` |

Multiple keys are supported (comma-separated in the env var). Missing or invalid keys return `401` with a JSON error.

When no keys are configured, authentication is skipped.

### `GET /api`

Returns a sample invoice PDF using built-in demo data. Useful for previewing the template during development.

```bash
curl -o sample-invoice.pdf http://localhost:3000/api \
  -H "x-api-key: your-api-key"
```

Or open [http://localhost:3000/api](http://localhost:3000/api) in your browser to view the PDF inline.

### `POST /api`

Generates a PDF from a JSON invoice payload.

**Headers:** `Content-Type: application/json`

If the body is missing or invalid JSON, the API falls back to the same demo data used by `GET`.

```bash
curl -X POST http://localhost:3000/api \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d @invoice.json \
  -o invoice.pdf
```

**JavaScript example:**

```javascript
const response = await fetch("https://your-domain.com/api", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "your-api-key",
  },
  body: JSON.stringify(invoicePayload),
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
window.open(url); // or trigger a download
```

### `OPTIONS /api`

CORS preflight. Returns allowed methods (`GET`, `POST`, `OPTIONS`) and headers.

## Invoice payload schema

The `InvoicePayload` type is defined in `components/InvoiceDocument.tsx`.

| Field             | Type     | Required | Description                                      |
| ----------------- | -------- | -------- | ------------------------------------------------ |
| `id`              | string   | Yes      | Invoice number displayed on the PDF              |
| `load_number`     | string   | Yes      | Reference number value shown on the PDF          |
| `load_number_label` | string | No     | Label before the reference (default: `Load`)     |
| `date`            | string   | Yes      | ISO 8601 date (e.g. `2025-06-06T12:00:00.000Z`) |
| `timezone`        | string   | Yes      | IANA timezone for formatting the invoice date    |
| `carrier`         | object   | Yes      | Payee / trucking company                         |
| `broker`          | object   | Yes      | Bill-to party                                    |
| `items`           | array    | Yes      | Line items (see below)                           |
| `color`           | string   | No       | Primary accent color, hex without `#` (default: `134A9E`) |
| `secondaryColor`  | string   | No       | Table header color, hex without `#`              |
| `adjustments`     | array    | No       | Dynamic additions and deductions (see below)     |

### `carrier` / `broker`

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `name`     | string | Yes      |
| `address`  | string | Yes      |
| `address2` | string | Yes    |
| `phone`    | string | Yes      |
| `email`    | string | Yes      |

### `items[]`

| Field         | Type   | Required | Description                          |
| ------------- | ------ | -------- | ------------------------------------ |
| `description` | string | Yes      | Line item title (e.g. "Line Haul")   |
| `notes`       | string | No       | Extra notes shown under description  |
| `quantity`    | number | Yes      | Quantity                             |
| `cost`        | number | Yes      | Unit rate in USD                     |
| `stops`       | array  | Yes      | Pickup/delivery stops (see below)    |

### `items[].stops[]`

| Field       | Type   | Required | Description                    |
| ----------- | ------ | -------- | ------------------------------ |
| `type`      | string | Yes      | e.g. `"Pickup"`, `"Delivery"`  |
| `city`      | string | Yes      | Location label / address       |
| `state`     | string | No       | State abbreviation             |
| `zip`       | string | No       | ZIP / postal code              |
| `datetime`  | string | No       | ISO date for first date column |
| `datetime2` | string | No       | Optional second date           |

### `adjustments[]`

| Field | Type | Required | Description |
|--------|--------|----------|-------------|
| `id` | string | Yes | Unique identifier for the adjustment |
| `description` | string | Yes | Label displayed in the totals section |
| `type` | `"addition"` \| `"deduction"` | Yes | Determines whether the amount increases or decreases the total |
| `amountCents` | number | Yes | Amount in integer cents (e.g. `15000` = `$150.00`) |

**Total calculation:**

```text
total = subtotal + additions - deductions
```

Where:

```text
subtotal = Σ(quantity × cost)
```

### Example payload

```json
{
  "id": "782",
  "load_number": "AJK-908121",
  "load_number_label": "Shipment",
  "date": "2025-06-06T15:30:00.000Z",
  "timezone": "America/Los_Angeles",
  "carrier": {
    "name": "Three Stars Transport Inc",
    "address": "1427 Evanwood Ave",
    "address2": "La Puente, California 91744",
    "phone": "(619) 939-6319",
    "email": "threestars039@gmail.com"
  },
  "broker": {
    "name": "CH GLOBAL",
    "address": "9731 SIEMPRE VIVA RD",
    "address2": "San Diego, California 92154",
    "phone": "(619) 555-1234",
    "email": "broker@example.com"
  },
  "adjustments": [
    {
      "id": "mock-adj-1",
      "description": "Detention at pickup location",
      "type": "addition",
      "amountCents": 15000
    },
    {
      "id": "mock-adj-2",
      "description": "QuickPay Processing Fee",
      "type": "deduction",
      "amountCents": 4000,
    }
  ],
  "items": [
    {
      "description": "Line Haul",
      "notes": "",
      "quantity": 1,
      "cost": 2000,
      "stops": [
        {
          "type": "Pickup",
          "city": "Sohnen Enterprise - 9043 Siempre Viva Rd, San Diego, CA",
          "state": "CA",
          "zip": "92154",
          "datetime": "2025-06-05T08:00:00.000Z",
          "datetime2": ""
        },
        {
          "type": "Delivery",
          "city": "Z & S 26 Electronics, Inc. - 967 E. 11th Street, Los Angeles, CA",
          "state": "CA",
          "zip": "90021",
          "datetime": "2025-06-06T14:00:00.000Z",
          "datetime2": ""
        }
      ]
    }
  ],
  "color": "134A9E",
  "secondaryColor": "134A9E"
}
```

Demo data for local testing lives in `app/api/fakePayLoad.ts`.

## Project structure

```
invoice4all/
├── app/
│   ├── api/
│   │   ├── route.jsx          # GET / POST / OPTIONS handlers
│   │   └── fakePayLoad.ts     # Sample invoice data
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── InvoiceDocument.tsx    # PDF template (main)
│   └── MyDocument.tsx         # Minimal react-pdf example (unused by API)
├── public/
└── package.json
```

## Customizing the PDF template

Edit `components/InvoiceDocument.tsx` to change layout, typography, or fields. The component uses react-pdf primitives (`Page`, `View`, `Text`, `StyleSheet`).

- **Colors:** Pass `color` and `secondaryColor` in the payload, or change the defaults in the component.
- **Fonts:** Roboto is registered in the component; add `.ttf` files under `public/fonts/` if you enable that family in styles.
- **Types:** Export type `InvoicePayload` is the source of truth for the expected JSON shape.

## Deployment

This is a standard Next.js app and deploys cleanly to [Vercel](https://vercel.com) or any Node.js host that supports Next.js 15.

```bash
npm run build
npm run start
```

Set your production URL when calling the API from client apps (e.g. `https://your-app.vercel.app/api`).

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [@react-pdf/renderer](https://react-pdf.org/) — PDF generation
- [number-to-words](https://www.npmjs.com/package/number-to-words) — written totals
- [Tailwind CSS 4](https://tailwindcss.com/) — included; API-focused, minimal UI

## License

Private project (`"private": true` in `package.json`).
