import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/providers";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "convex-s3-universal",
  description: "convex-s3-universal",
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} 
  antialiased`}
          suppressHydrationWarning={true} // Add this line
        >
          <ClerkProvider>
            <Providers>
              <div className="grid grid-rows-[auto_1fr] h-svh">
                <Header />
                {children}
              </div>
            </Providers>
          </ClerkProvider>
        </body>
      </html>
    );
  }