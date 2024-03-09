"use client";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
export default function Header({
  loggedIn,
  name,
  imageUrl,
}: {
  loggedIn: boolean;
  name: string;
  imageUrl: string;
}) {
  const pathname = usePathname();
  return (
    <header className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900">
      <div className="flex items-center space-x-4">
        <div className="overflow-hidden rounded-full transition-transform hover:scale-105">
          {imageUrl && (
            <Image
              alt="Profile"
              className="object-cover"
              height="40"
              src={imageUrl}
              width="40"
            />
          )}
        </div>
        <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-50">
          {name}
        </h1>
      </div>
      <div className="flex items-center gap-5">
        {pathname !== "/" && (
          <Link
            className=" transition-all bg-white hover:bg-slate-700 hover:text-white text-black font-bold py-2 px-4 rounded"
            href="/"
          >
            Home
          </Link>
        )}
        {loggedIn && pathname !== "/youtube-upload" && (
          <Link
            className=" transition-all bg-white hover:bg-slate-700 hover:text-white text-black font-bold py-2 px-4 rounded"
            href="/youtube-upload"
          >
            Youtube Upload
          </Link>
        )}
        {!loggedIn ? (
          <Link
            className="transition-all bg-white hover:bg-slate-700 hover:text-white text-black font-bold py-2 px-4 rounded"
            href="/api/auth/signin"
          >
            Login
          </Link>
        ) : (
          <Link
            className="transition-all bg-white hover:bg-slate-700 hover:text-white text-black font-bold py-2 px-4 rounded"
            href="/api/auth/signout"
          >
            SignOut
          </Link>
        )}
      </div>
    </header>
  );
}
