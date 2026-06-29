import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/app-layout";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Doremoney",
  description: "Quản lý tài chính cá nhân thông minh",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#18181b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/20 blur-[120px]" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/20 blur-[120px]" />
            <div className="absolute top-[30%] left-[50%] w-[40%] h-[40%] rounded-full bg-blue-500/15 blur-[100px]" />
          </div>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
