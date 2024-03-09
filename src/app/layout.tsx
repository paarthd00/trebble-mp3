import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Trebble MP3",
  description: "Music player for the modern web",
};
import Header from "./components/header";
import { auth } from "@/auth";
import MusicListSkeleton from "./skeletons/musiclist-skeleton";
import { Suspense } from "react";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/instantsearch.css@7/themes/satellite-min.css"
        />
      </head>
      <body
        className={twMerge(
          inter.className,
          "container flex flex-col justify-center mx-auto",
        )}
      >
        <Header
          loggedIn={session?.user !== undefined || false}
          name={session?.user?.name || ""}
          imageUrl={session?.user?.image || ""}
        />
        <Suspense fallback={<MusicListSkeleton />}>{children}</Suspense>
      </body>
    </html>
  );
}
