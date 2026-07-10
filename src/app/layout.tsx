import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "เทพประทาน จันทร์ปัญญา — Gameplay & Full-Stack Engineer",
  description: "Computer engineering graduate. Gameplay programmer and full-stack developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body className="font-sans font-display">
        {children}
      </body>
    </html>
  );
}