import type { Metadata } from "next";
import { Oxygen, Oxygen_Mono } from "next/font/google";
import "./globals.css";

const oxygenSans = Oxygen({
  variable: "--font-oxygen-sans",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const oxygenMono = Oxygen_Mono({
  variable: "--font-oxygen-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Franklin Zhu",
  description: "Franklin Zhu's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oxygenSans.variable} ${oxygenMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
