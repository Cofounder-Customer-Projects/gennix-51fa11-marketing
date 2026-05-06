import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { MarketingAnalytics } from "@/components/MarketingAnalytics";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Managed Marketing Starter",
  description: "A seeded Next.js marketing starter with conversion tracking hooks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const isPreviewEnvironment =
    process.env.NODE_ENV !== "development" &&
    (process.env.VERCEL_TARGET_ENV === "preview" ||
      process.env.VERCEL_ENV === "preview");

  return (
    <html lang="en">
      <body className="min-h-screen">
        <MarketingAnalytics />
        {isPreviewEnvironment ? (
          <Script
            src="https://app.cofounder.co/agentation/widget.js"
            strategy="afterInteractive"
          />
        ) : null}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
