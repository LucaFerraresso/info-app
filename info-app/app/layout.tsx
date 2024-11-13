import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/section/navbar";
import Footer from "@/components/section/footer";

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground ">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Main container to hold the whole layout */}
          <div className="flex flex-col min-h-screen">
            {/* Navbar component */}
            <Navbar />

            {/* Main content area */}
            <main className="flex-1 flex flex-col justify-center items-center">
              {children}
            </main>

            {/* Footer component */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
