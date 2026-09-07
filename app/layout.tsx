import type { Metadata } from "next";
import { Poppins, Raleway, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/app/_lib/utils";
import Header from "./_components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Task Player",
  description: "Count the time spent on each task.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        raleway.variable,
        poppins.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body
        className="min-h-full flex flex-col bg-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
