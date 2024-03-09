"use client";
import { songListType } from "../page";
import { useEffect, useState } from "react";
import Image from "next/image";
import { songType } from "@/db/schema/song";
import { coverArtType } from "@/db/schema/cover-art";
import Link from "next/link";
import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import SongMenu from "./song-menu";
import ReactAudioPlayer from "react-audio-player";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function MusicList({
	songList,
}: {
	songList: songListType;
}) {
	const [playingSong, setPlayingSong] = useState<{
		songs: songType | null;
		coverArts: coverArtType | null;
	}>();

	return (
		// <div className=" mx-auto py-10 h-screen grid lg:grid-cols-[1fr_1fr] grid-cols-1 gap-8">
		<ResizablePanelGroup
			direction="horizontal"
			
			className=" max-w-full rounded-lg border h-full"
		>
			<ResizablePanel >
				<aside className="px-3 py-4 rounded h-full overflow-auto dark:bg-zinc-800/40">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-lg mb-4">Songs</h2>
						<Link href="/addsong">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="black"
								stroke="black"
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
						<div className="space-y-3 pb-5">
							{songList &&
								songList.map((song, i) => {
									return (
										<div className="flex items-center gap-2 pb-2" key={i}>
											<SongMenu currentSong={song} />
											<figure className="w-[4rem] pb-2 h-[4rem]  overflow-hidden">
												{song.coverArts?.url ? (
													<Image
														alt="cover image"
														src={song.coverArts?.url}
														className="object-cover w-full h-full"
														width={256}
														height={256}
													/>
												) : (
													<div className="animate-pulse bg-muted h-full w-full rounded-lg"></div>
												)}
											</figure>
											<button
												onClick={() => {
													setPlayingSong(song);
												}}
												className="w-full justify-start"
											>
												{song.songs?.songName}
											</button>
											{playingSong?.songs?.id === song.songs?.id && (
												<svg
													className="w-8 h-8 animate-bounce"
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
													<path d="M9 18V5l12-2v13" />
													<circle cx="6" cy="18" r="3" />
													<circle cx="18" cy="16" r="3" />
												</svg>
											)}
										</div>
									);
								})}
						</div>
					</nav>
				</aside>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel>
				<main className="h-full overflow-auto bg-white dark:bg-zinc-950 px-5 py-6 rounded">
					<h2 className="mx-auto text-center font-semibold text-2xl mb-4">
						Playing Now
					</h2>
					<div className="flex flex-col justify-center items-center space-y-2">
						<div className="flex justify-center rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
							<figure className="w-[20rem] h-[20rem] overflow-hidden">
								{playingSong?.coverArts?.url ? (
									<Image
										alt="Song cover image"
										className="object-cover rounded-md h-full w-full"
										height="1024"
										src={playingSong?.coverArts?.url}
										width="1024"
									/>
								) : (
									<div className="animate-pulse bg-muted h-full w-full rounded-lg"></div>
								)}
							</figure>
						</div>
						<ReactAudioPlayer
							src={playingSong?.songs?.songUrl}
							autoPlay
							controls
						/>
						<h3 className="text-xl font-bold text-center">
							{playingSong?.songs?.songName}
						</h3>
					</div>
				</main>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
