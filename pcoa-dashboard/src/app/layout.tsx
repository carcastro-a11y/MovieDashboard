import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PCoA Rail Builder",
  description: "Build custom movie rails using PCoA dimension scores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
