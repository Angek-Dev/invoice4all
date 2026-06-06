import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "invoice4all — PDF Invoice API Documentation",
  description:
    "Generate professional logistics invoices as PDFs. REST API documentation for trucking and freight billing workflows.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
