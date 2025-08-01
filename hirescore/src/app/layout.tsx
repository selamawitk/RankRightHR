import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HireScore - AI-Powered HR Platform",
  description:
    "Streamline your hiring process with AI-powered candidate evaluation for small and medium businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
