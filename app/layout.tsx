import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monster Maker - AI Image to Monster Transformer",
  description: "Transform any image into a terrifying creature with AI. Generate 3D models for printing!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
