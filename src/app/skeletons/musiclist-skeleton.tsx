"use client"
import { songListType } from "../page"
import Link from "next/link"



export default function MusicListSkeleton() {
      return (
            <div className=" mx-auto py-10 h-screen grid grid-cols-[1fr_2fr] gap-8">
                  <aside className="px-3 py-4 rounded h-full overflow-auto bg-zinc-100/40 dark:bg-zinc-800/40">
                        <div className="flex items-center justify-between">
                              <h2 className="font-semibold text-lg mb-4">Songs</h2>
                              <Link href="/addsong">
                                    <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                    >
                                          <path d="M5 12h14" />
                                          <path d="M12 5v14" />
                                    </svg>
                              </Link>
                        </div>
                        <nav>
                              <div className="space-y-1">

                                    <div className="flex items-center">
                                          <figure className="w-[4rem] h-[4rem] rounded-full overflow-hidden bg-slate-700">
                                                <div className="animate-pulse bg-muted h-[4rem] w-[4rem] rounded-lg"></div>
                                          </figure>
                                          <button
                                                className="w-full justify-start">

                                          </button>
                                    </div>
                              </div>
                        </nav>
                  </aside>
                  <main className="h-full overflow-auto bg-white dark:bg-zinc-950 px-5 py-6 rounded">
                        <h2 className="mx-auto text-center font-semibold text-2xl mb-4">Playing Now</h2>
                        <div className="flex flex-col justify-center items-center space-y-2">

                              <div className="flex justify-center rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
                                    <div className="animate-pulse bg-muted h-100 w-100 rounded-lg"></div>
                              </div>

                              <h3 className="text-xl font-bold">

                              </h3>
                        </div>
                  </main>
            </div>
      )
}
