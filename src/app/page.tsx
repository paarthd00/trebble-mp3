import { auth } from "@/auth"
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { songs, songType } from '@/db/schema/song';
import { coverArts, coverArtType } from '@/db/schema/cover-art';
import MusicList from './components/musiclist';
import MusicListSkeleton from "./skeletons/musiclist-skeleton";
import { Suspense } from "react";
import { redirect } from "next/navigation";
export type songListType = {
      songs: songType | null,
      coverArts: coverArtType | null
}[]

export default async function Home() {
      const session = await auth();
      if (!session) {
            redirect('/api/auth/signin');
      }
      const songList: songListType = await db.select()
            .from(songs)
            .leftJoin(coverArts, eq(songs.coverArtId, coverArts.id))
            .where(eq(songs.userId, session.user.id));

      if (!songList) {
            return <MusicListSkeleton />
      }

      return (
            <main className="flex h-full w-full min-h-screen flex-col items-center justify-between lg:pt-0">
                  {session?.user && (
                        <div className='w-full flex flex-col items-center flex-start gap-3'>
                              <div className="animate-pulse bg-muted h-[4rem] w-[4rem] rounded-lg"></div>
                              <Suspense fallback={
                                    <div className="animate-pulse bg-muted h-[4rem] w-[4rem] rounded-lg"></div>
                              } >
                                    <MusicList ALGOLIA_APP_ID={process.env.ALGOLIA_APP_ID!} ALGOLIA_SEARCH_KEY={process.env.ALGOLIA_SEARCH_KEY!} songList={songList} />
                              </Suspense>
                        </div>
                  )}

                  {!session?.user && (
                        <>
                              This is the Trebble Music App, To enjoy latest music please sign in.
                        </>
                  )}
            </main>
      )
}


