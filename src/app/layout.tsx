import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dataFont = JetBrains_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "LLM-BENCH — Local Inference Readout Unit",
  description:
    "Configure a GPU/CPU/RAM build and read its local LLM inference numbers: tokens/sec, VRAM fit, and time-to-first-token.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${dataFont.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-(--board) text-(--ink)">{children}</body>
    </html>
  );
}
